import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
// Import new Maps component with real Google Maps support
import MapViewComponent from "@/components/MapViewExpo";

interface Destination {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function StartJourneyScreen() {
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Destination[]>([]);

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("Error", "Unable to get current location");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        getCurrentLocation();
      } else {
        Alert.alert("Permission Required", "Location permission is needed to track your journey.");
      }
    } catch (error) {
      console.error("Permission error:", error);
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  // Mock search function - replace with Google Places API later
  const searchDestinations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Mock destinations for Bandung area
    const mockResults: Destination[] = [
      {
        name: "Gedung Sate",
        latitude: -6.9024,
        longitude: 107.6186,
        address: "Jl. Diponegoro No.22, Citarum, Bandung Wetan, Bandung",
      },
      {
        name: "Trans Studio Bandung",
        latitude: -6.9429,
        longitude: 107.6363,
        address: "Jl. Gatot Subroto No.289, Cibangkong, Batununggal, Bandung",
      },
      {
        name: "Jalan Dago",
        latitude: -6.87,
        longitude: 107.6139,
        address: "Jl. Ir. H. Juanda (Dago), Coblong, Bandung",
      },
      {
        name: "Alun-alun Bandung",
        latitude: -6.9175,
        longitude: 107.6191,
        address: "Alun-alun, Regol, Bandung",
      },
      {
        name: "Bandung Institute of Technology",
        latitude: -6.8915,
        longitude: 107.6107,
        address: "Jl. Ganesha No.10, Lb. Siliwangi, Coblong, Bandung",
      },
    ].filter((place) => place.name.toLowerCase().includes(query.toLowerCase()) || place.address.toLowerCase().includes(query.toLowerCase()));

    setSearchResults(mockResults);
  };

  const selectDestination = (dest: Destination) => {
    setDestination(dest);
    setSearchQuery(dest.name);
    setSearchResults([]);
  };

  const startJourney = () => {
    if (!currentLocation) {
      Alert.alert("Error", "Current location not available");
      return;
    }

    if (!destination) {
      Alert.alert("Error", "Please select a destination");
      return;
    }

    // Navigate to tracking screen with route params
    router.push({
      pathname: "/journey-tracking" as any,
      params: {
        startLat: currentLocation.latitude,
        startLng: currentLocation.longitude,
        destLat: destination.latitude,
        destLng: destination.longitude,
        destName: destination.name,
        destAddress: destination.address,
      },
    });
  };

  const mapRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: -6.9175,
        longitude: 107.6191,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Mulai Perjalanan</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Current Location */}
        <View style={styles.locationCard}>
          <FontAwesome name="map-marker" size={20} color="#4CAF50" />
          <View style={styles.locationInfo}>
            <ThemedText style={styles.locationLabel}>Lokasi Saat Ini</ThemedText>
            <ThemedText style={styles.locationText}>{currentLocation ? "GPS Location Found" : "Getting location..."}</ThemedText>
          </View>
          {isLoading && <ActivityIndicator size="small" color="#007AFF" />}
        </View>

        {/* Destination Search */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari tujuan..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchDestinations(text);
            }}
            placeholderTextColor="#999999"
          />
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.searchResults}>
            {searchResults.map((result, index) => (
              <TouchableOpacity key={index} style={styles.resultItem} onPress={() => selectDestination(result)}>
                <FontAwesome name="map-pin" size={16} color="#666666" />
                <View style={styles.resultInfo}>
                  <ThemedText style={styles.resultName}>{result.name}</ThemedText>
                  <ThemedText style={styles.resultAddress}>{result.address}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapViewComponent
            latitude={mapRegion.latitude}
            longitude={mapRegion.longitude}
            showUserLocation={true}
            style={styles.map}
            markers={[
              ...(currentLocation
                ? [
                    {
                      id: "current",
                      latitude: currentLocation.latitude,
                      longitude: currentLocation.longitude,
                      title: "Lokasi Saat Ini",
                    },
                  ]
                : []),
              ...(destination
                ? [
                    {
                      id: "destination",
                      latitude: destination.latitude,
                      longitude: destination.longitude,
                      title: destination.name,
                      description: destination.address,
                    },
                  ]
                : []),
            ]}
          />
        </View>

        {/* Journey Info */}
        {destination && currentLocation && (
          <View style={styles.journeyInfo}>
            <ThemedText style={styles.journeyTitle}>Rencana Perjalanan</ThemedText>
            <View style={styles.journeyDetails}>
              <View style={styles.journeyRow}>
                <FontAwesome name="map-marker" size={16} color="#4CAF50" />
                <ThemedText style={styles.journeyText}>Lokasi Saat Ini</ThemedText>
              </View>
              <View style={styles.journeyDivider} />
              <View style={styles.journeyRow}>
                <FontAwesome name="flag" size={16} color="#F44336" />
                <ThemedText style={styles.journeyText}>{destination.name}</ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Start Button */}
        <TouchableOpacity style={[styles.startButton, (!currentLocation || !destination) && styles.startButtonDisabled]} onPress={startJourney} disabled={!currentLocation || !destination}>
          <FontAwesome name="play" size={20} color="white" />
          <ThemedText style={styles.startButtonText}>Mulai Perjalanan</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  placeholder: {
    width: 40,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  searchResults: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 4,
  },
  resultAddress: {
    fontSize: 14,
    color: "#666666",
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  journeyInfo: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  journeyDetails: {
    paddingLeft: 8,
  },
  journeyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  journeyText: {
    fontSize: 16,
    color: "#1f2937",
    marginLeft: 12,
  },
  journeyDivider: {
    width: 2,
    height: 20,
    backgroundColor: "#e5e7eb",
    marginLeft: 7,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
