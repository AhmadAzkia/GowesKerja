// import MapViewComponent from "@/components/MapView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Redirect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
// import { auth } from "../../config/firebase";
import { auth } from "../../config/firebase.mock";
import { MockDataService, RouteData } from "../../services/mockDataService";

interface UserData {
  name: string;
  email: string;
  totalTrips: number;
  totalDistance: string;
  co2Saved: string;
  points: number;
}

export default function HomeScreen() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [popularRoutes, setPopularRoutes] = useState<RouteData[]>([]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateUserStats = useCallback(
    async (currentUserData: UserData) => {
      try {
        // Use MockDataService to calculate stats
        const stats = await MockDataService.calculateUserStats(user?.uid);

        const updatedData: UserData = {
          ...currentUserData,
          totalTrips: stats.totalTrips,
          totalDistance: `${stats.totalDistance.toFixed(1)} km`,
          co2Saved: `${stats.co2Saved.toFixed(1)} kg`,
          points: stats.points,
        };

        setUserData(updatedData);
        await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error updating user stats:", error);
        setUserData(currentUserData);
      }
    },
    [user]
  );

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Update statistik berdasarkan trip history
        await updateUserStats(parsedData);
      } else {
        // Default data jika belum ada
        const defaultData: UserData = {
          name: user?.displayName || "User",
          email: user?.email || "user@example.com",
          totalTrips: 0,
          totalDistance: "0 km",
          co2Saved: "0 kg",
          points: 0,
        };
        setUserData(defaultData);
        await AsyncStorage.setItem("userData", JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Fallback data
      setUserData({
        name: user?.displayName || "User",
        email: user?.email || "user@example.com",
        totalTrips: 0,
        totalDistance: "0 km",
        co2Saved: "0 kg",
        points: 0,
      });
    }
  }, [user, updateUserStats]);

  const loadPopularRoutes = useCallback(async () => {
    try {
      // Pass user ID to get popular routes for this user only
      const routes = await MockDataService.getPopularRoutes(user?.uid);
      setPopularRoutes(routes);
    } catch (error) {
      console.error("Error loading popular routes:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadPopularRoutes();
    }
  }, [user, loadUserData, loadPopularRoutes]);

  // Initialize mock data on component mount (tanpa sample data untuk user baru)
  useEffect(() => {
    MockDataService.initializeData(false); // false = tidak tambahkan sample data
    // Debug: lihat apa yang ada di storage
    MockDataService.debugStorage();
    // Don't load popular routes here - wait for user to login
  }, []);

  // Initialize new user when user login for first time
  useEffect(() => {
    if (user) {
      MockDataService.initializeNewUser(user.uid);
    }
  }, [user]);

  // Helper untuk greeting berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Jika masih loading, tampilkan loading
  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={{ marginTop: 16, color: "#6b7280" }}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Jika user belum login, redirect ke login
  if (!user) {
    return <Redirect href="/login" />;
  }

  const renderRouteCard = ({ item }: { item: RouteData }) => (
    <TouchableOpacity style={styles.routeCard}>
      <View style={styles.routeIconContainer}>
        <FontAwesome name={item.icon as any} size={24} color="#007AFF" />
      </View>
      <ThemedText style={styles.routeName}>{item.name}</ThemedText>
      <View style={styles.routeDetails}>
        <View style={styles.routeDetailRow}>
          <FontAwesome name="road" size={12} color="#666666" />
          <ThemedText style={styles.routeDetailText}>{item.distance}</ThemedText>
        </View>
        <View style={styles.routeDetailRow}>
          <FontAwesome name="line-chart" size={12} color="#666666" />
          <ThemedText style={styles.routeDetailText}>{item.elevation}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerText}>
            {getGreeting()}, {userData?.name || user?.displayName || "User"}!
          </ThemedText>
          <FontAwesome name="bell" size={24} color="#007AFF" />
        </View>

        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Total Jarak */}
          <View style={styles.card}>
            <FontAwesome name="map-marker" size={24} color="#FF6B6B" style={styles.cardIcon} />
            <ThemedText style={styles.cardLabel}>Total Jarak</ThemedText>
            <ThemedText style={styles.cardValue}>{userData?.totalDistance || "0 km"}</ThemedText>
          </View>

          {/* Card 2: CO2 Terhemat */}
          <View style={styles.card}>
            <FontAwesome name="leaf" size={24} color="#4ECDC4" style={styles.cardIcon} />
            <ThemedText style={styles.cardLabel}>CO2 Terhemat</ThemedText>
            <ThemedText style={styles.cardValue}>{userData?.co2Saved || "0 kg"}</ThemedText>
          </View>

          {/* Card 3: Poin Anda */}
          <View style={styles.card}>
            <FontAwesome name="star" size={24} color="#FFE66D" style={styles.cardIcon} />
            <ThemedText style={styles.cardLabel}>Poin Anda</ThemedText>
            <ThemedText style={styles.cardValue}>{userData?.points?.toLocaleString() || "0"}</ThemedText>
          </View>
        </View>

        {/* Start Journey Button */}
        <TouchableOpacity style={styles.startButton}>
          <ThemedText style={styles.startButtonText}>Mulai Perjalanan</ThemedText>
        </TouchableOpacity>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <ThemedText style={styles.sectionTitle}>Peta Bandung</ThemedText>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <FontAwesome name="map" size={48} color="#3b82f6" />
              <ThemedText style={styles.mapPlaceholderTitle}>Google Maps - Bandung</ThemedText>
              <ThemedText style={styles.mapPlaceholderSubtitle}>Maps sedang dikonfigurasi</ThemedText>
              <ThemedText style={styles.mapPlaceholderNote}>Lokasi: Gedung Sate, Dago, Trans Studio</ThemedText>
            </View>
          </View>
        </View>

        {/* Popular Routes Section */}
        <View style={styles.routesSection}>
          <ThemedText style={styles.sectionTitle}>Rute Populer</ThemedText>
          {popularRoutes.length > 0 ? (
            <FlatList data={popularRoutes} renderItem={renderRouteCard} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routesList} />
          ) : (
            <View style={styles.emptyRoutesContainer}>
              <FontAwesome name="map-o" size={48} color="#d1d5db" />
              <ThemedText style={styles.emptyRoutesText}>Belum ada rute populer</ThemedText>
              <ThemedText style={styles.emptyRoutesSubtext}>Mulai perjalanan pertama Anda untuk melihat rute populer</ThemedText>
            </View>
          )}
        </View>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    textAlign: "center",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  mapSection: {
    marginBottom: 24,
  },
  mapContainer: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  map: {
    flex: 1,
    height: 250,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 16,
    textAlign: "center",
  },
  mapPlaceholderSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  mapPlaceholderNote: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  routesSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937",
  },
  routesList: {
    paddingLeft: 0,
  },
  routeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 176,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  routeIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#eff6ff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
    lineHeight: 20,
  },
  routeDetails: {
    flexDirection: "column",
    gap: 8,
  },
  routeDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeDetailText: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyRoutesContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyRoutesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
    textAlign: "center",
  },
  emptyRoutesSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
