import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from "react-native";
// Import new Maps component with real Google Maps support
import MapViewComponent from "@/components/MapViewExpo";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";
import { MockDataService } from "../services/mockDataService";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface JourneyData {
  startLocation: LocationCoords;
  destination: LocationCoords;
  currentLocation: LocationCoords;
  distance: number;
  duration: number;
  isCompleted: boolean;
  route: LocationCoords[];
}

export default function JourneyTrackingScreen() {
  const params = useLocalSearchParams();
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationWatcher, setLocationWatcher] = useState<Location.LocationSubscription | null>(null);
  const [user, setUser] = useState<any>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  // Extract param values to avoid object reference changes
  const startLat = params.startLat as string;
  const startLng = params.startLng as string;
  const destLat = params.destLat as string;
  const destLng = params.destLng as string;

  useEffect(() => {
    // Get user
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
    });

    // Initialize journey data from params
    if (startLat && startLng && destLat && destLng) {
      const startLocation = {
        latitude: parseFloat(startLat),
        longitude: parseFloat(startLng),
      };

      const destination = {
        latitude: parseFloat(destLat),
        longitude: parseFloat(destLng),
      };

      setJourneyData({
        startLocation,
        destination,
        currentLocation: startLocation,
        distance: 0,
        duration: 0,
        isCompleted: false,
        route: [startLocation],
      });
    }

    return () => {
      unsubscribe();
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [startLat, startLng, destLat, destLng, timer]);

  const startTracking = async () => {
    try {
      setIsTracking(true);

      // Start GPS tracking
      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Or every 10 meters
        },
        (location) => {
          updateLocation(location.coords);
        }
      );

      // Start timer for duration tracking (every second)
      const durationTimer = setInterval(() => {
        setJourneyData((prev) =>
          prev && !prev.isCompleted
            ? {
                ...prev,
                duration: prev.duration + 1, // Add 1 second
              }
            : prev
        );
      }, 1000);

      setLocationWatcher(watcher);
      setTimer(durationTimer);
    } catch (error) {
      console.error("Tracking error:", error);
      Alert.alert("Error", "Failed to start location tracking");
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    if (locationWatcher) {
      locationWatcher.remove();
      setLocationWatcher(null);
    }
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsTracking(false);
  };

  const updateLocation = (newLocation: Location.LocationObjectCoords) => {
    if (!journeyData) return;

    const newCoords = {
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
    };

    // Calculate distance traveled
    const lastLocation = journeyData.route[journeyData.route.length - 1];
    const segmentDistance = calculateDistance(lastLocation, newCoords);
    const totalDistance = journeyData.distance + segmentDistance;

    // Check if reached destination (within 50 meters)
    const distanceToDestination = calculateDistance(newCoords, journeyData.destination);
    const hasReachedDestination = distanceToDestination < 0.05; // 50 meters

    setJourneyData((prev) =>
      prev
        ? {
            ...prev,
            currentLocation: newCoords,
            distance: totalDistance,
            route: [...prev.route, newCoords],
            isCompleted: hasReachedDestination,
          }
        : null
    );

    if (hasReachedDestination) {
      completeJourney(totalDistance, false);
    }
  };

  const calculateDistance = (point1: LocationCoords, point2: LocationCoords): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((point1.latitude * Math.PI) / 180) * Math.cos((point2.latitude * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const completeJourney = async (totalDistance: number, isManualFinish: boolean = false) => {
    stopTracking();

    // Calculate points (1 point per 100 meters)
    const points = Math.floor(totalDistance * 10);
    const co2Saved = totalDistance * 0.21; // Estimate: 0.21 kg CO2 per km saved

    try {
      // Save journey data
      if (user) {
        await MockDataService.addTripHistory(user.uid, {
          distance: `${totalDistance.toFixed(1)} km`,
          duration: `${Math.floor((journeyData?.duration || 0) / 60)} menit`,
          route: (params.destName as string) || "Unknown",
          date: new Date().toLocaleDateString("id-ID"),
          points: points,
          co2Saved: `${co2Saved.toFixed(1)} kg`,
        });

        const completionMessage = isManualFinish
          ? `Perjalanan Selesai!\n\nAnda telah menempuh ${totalDistance.toFixed(1)} km dan mendapat ${points} poin!\n\nCO2 yang dihemat: ${co2Saved.toFixed(1)} kg\n\nTerima kasih telah bersepeda! 🚴‍♂️`
          : `Selamat! Tujuan Tercapai! 🎉\n\nAnda telah menempuh ${totalDistance.toFixed(1)} km dan mendapat ${points} poin!\n\nCO2 yang dihemat: ${co2Saved.toFixed(1)} kg`;

        Alert.alert("🚴‍♂️ Selamat!", completionMessage, [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ]);
      }
    } catch (error) {
      console.error("Error saving journey:", error);
      Alert.alert("Error", "Failed to save journey data");
    }
  };

  const finishJourneyManually = () => {
    Alert.alert("Selesaikan Perjalanan?", "Anda akan mendapat poin sesuai dengan jarak yang sudah ditempuh. Yakin ingin menyelesaikan perjalanan sekarang?", [
      { text: "Tidak", style: "cancel" },
      {
        text: "Ya, Selesai",
        style: "default",
        onPress: () => {
          if (journeyData) {
            completeJourney(journeyData.distance, true);
          }
        },
      },
    ]);
  };

  const cancelJourney = () => {
    Alert.alert("Batalkan Perjalanan?", "Apakah Anda yakin ingin membatalkan perjalanan ini?", [
      { text: "Tidak", style: "cancel" },
      {
        text: "Ya",
        style: "destructive",
        onPress: () => {
          stopTracking();
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  if (!journeyData) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading journey...</ThemedText>
      </ThemedView>
    );
  }

  const mapRegion = {
    latitude: journeyData.currentLocation.latitude,
    longitude: journeyData.currentLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <ThemedView style={styles.container}>
      {/* Map */}
      <MapViewComponent
        latitude={mapRegion.latitude}
        longitude={mapRegion.longitude}
        showUserLocation={true}
        style={styles.map}
        markers={[
          {
            id: "start",
            latitude: journeyData.startLocation.latitude,
            longitude: journeyData.startLocation.longitude,
            title: "Start",
          },
          {
            id: "destination",
            latitude: journeyData.destination.latitude,
            longitude: journeyData.destination.longitude,
            title: (params.destName as string) || "Destination",
            description: params.destAddress as string,
          },
          ...(journeyData.currentLocation
            ? [
                {
                  id: "current",
                  latitude: journeyData.currentLocation.latitude,
                  longitude: journeyData.currentLocation.longitude,
                  title: "Current Location",
                },
              ]
            : []),
        ]}
      />

      {/* Journey Info Overlay */}
      <View style={styles.overlay}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="road" size={16} color="#666666" />
            <ThemedText style={styles.statValue}>{journeyData.distance.toFixed(1)} km</ThemedText>
            <ThemedText style={styles.statLabel}>Jarak</ThemedText>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <FontAwesome name="clock-o" size={16} color="#666666" />
            <ThemedText style={styles.statValue}>
              {Math.floor(journeyData.duration / 60)}:{(journeyData.duration % 60).toString().padStart(2, "0")}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Waktu</ThemedText>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <FontAwesome name="star" size={16} color="#666666" />
            <ThemedText style={styles.statValue}>{Math.floor(journeyData.distance * 10)}</ThemedText>
            <ThemedText style={styles.statLabel}>Poin</ThemedText>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {!isTracking ? (
            <TouchableOpacity style={styles.startButton} onPress={startTracking}>
              <FontAwesome name="play" size={20} color="white" />
              <ThemedText style={styles.buttonText}>Mulai Tracking</ThemedText>
            </TouchableOpacity>
          ) : (
            <View style={styles.trackingButtonsContainer}>
              <TouchableOpacity style={styles.pauseButton} onPress={stopTracking}>
                <FontAwesome name="pause" size={20} color="white" />
                <ThemedText style={styles.buttonText}>Pause</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.finishButton} onPress={finishJourneyManually}>
                <FontAwesome name="flag-checkered" size={20} color="white" />
                <ThemedText style={styles.buttonText}>Selesai</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={cancelJourney}>
            <FontAwesome name="times" size={20} color="#F44336" />
            <ThemedText style={styles.cancelButtonText}>Batalkan</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Destination Info */}
      <View style={styles.destinationInfo}>
        <ThemedText style={styles.destinationLabel}>Tujuan:</ThemedText>
        <ThemedText style={styles.destinationName}>{(params.destName as string) || "Unknown"}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  controlsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  startButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stopButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  trackingButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  pauseButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  finishButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F44336",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  destinationInfo: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  destinationLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
});
