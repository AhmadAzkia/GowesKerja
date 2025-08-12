import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { auth } from "../../config/firebase.mock";
import { MockDataService } from "../../services/mockDataService";

interface ProfileData {
  name: string;
  email: string;
  joinDate: string;
  totalTrips: number;
  totalDistance: string;
  co2Saved: string;
  points: number;
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const updateProfileStats = useCallback(
    async (currentProfileData: ProfileData) => {
      try {
        // Use MockDataService to calculate stats untuk user ini saja
        const stats = await MockDataService.calculateUserStats(user?.uid);

        const updatedData: ProfileData = {
          ...currentProfileData,
          totalTrips: stats.totalTrips,
          totalDistance: `${stats.totalDistance.toFixed(1)} km`,
          co2Saved: `${stats.co2Saved.toFixed(1)} kg`,
          points: stats.points,
        };

        setProfileData(updatedData);
        await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error updating profile stats:", error);
        setProfileData(currentProfileData);
      }
    },
    [user]
  );

  const loadProfileData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Update nama dan email dengan data user yang sebenarnya
        const updatedData = {
          ...parsedData,
          name: user.displayName || parsedData.name || "User",
          email: user.email || parsedData.email || "user@example.com",
        };
        // Update statistik berdasarkan trip history untuk user ini
        await updateProfileStats(updatedData);
      } else {
        // Default profile data berdasarkan user yang login
        const defaultData: ProfileData = {
          name: user.displayName || "User",
          email: user.email || "user@example.com",
          joinDate: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          totalTrips: 0,
          totalDistance: "0 km",
          co2Saved: "0 kg",
          points: 0,
        };
        setProfileData(defaultData);
        await AsyncStorage.setItem("userData", JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      // Fallback data dengan info user yang login
      setProfileData({
        name: user?.displayName || "User",
        email: user?.email || "user@example.com",
        joinDate: "Hari ini",
        totalTrips: 0,
        totalDistance: "0 km",
        co2Saved: "0 kg",
        points: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [user, updateProfileStats]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleLogout = async () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Sign out from Firebase auth (mock)
            await auth().signOut();
            // Remove local user data
            await AsyncStorage.removeItem("userData");
            // Navigate to login - the _layout.tsx will handle automatic routing
            router.replace("/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Gagal logout");
          }
        },
      },
    ]);
  };

  // Temporary function for clearing all data (untuk testing)
  const handleClearAllData = async () => {
    Alert.alert("Clear All Data", "Ini akan menghapus semua data trip history dan leaderboard. Yakin?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await MockDataService.clearAllData();
            await AsyncStorage.clear();
            Alert.alert("Sukses", "Semua data telah dihapus.");
            // Reload data
            loadProfileData();
          } catch (error) {
            console.error("Error clearing data:", error);
            Alert.alert("Error", "Gagal menghapus data.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Memuat profil...</ThemedText>
      </ThemedView>
    );
  }

  if (!profileData) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <FontAwesome name="user-times" size={64} color="#999" />
        <ThemedText style={styles.noDataText}>Tidak ada data profil yang tersedia</ThemedText>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/login")}>
          <ThemedText style={styles.loginButtonText}>Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header Profile */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={40} color="white" />
          </View>
          <ThemedText style={styles.profileName}>{profileData.name}</ThemedText>
          <ThemedText style={styles.profileEmail}>{profileData.email}</ThemedText>
          <ThemedText style={styles.profileJoinDate}>Bergabung {profileData.joinDate}</ThemedText>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statisticsSection}>
          <ThemedText style={styles.sectionTitle}>Statistik Saya</ThemedText>

          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
              <FontAwesome name="bicycle" size={24} color="#007AFF" />
              <ThemedText style={styles.statsValue}>{profileData.totalTrips}</ThemedText>
              <ThemedText style={styles.statsLabel}>Total Perjalanan</ThemedText>
            </View>

            <View style={styles.statsCard}>
              <FontAwesome name="road" size={24} color="#34C759" />
              <ThemedText style={styles.statsValue}>{profileData.totalDistance}</ThemedText>
              <ThemedText style={styles.statsLabel}>Jarak Tempuh</ThemedText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
              <FontAwesome name="leaf" size={24} color="#32D74B" />
              <ThemedText style={styles.statsValue}>{profileData.co2Saved}</ThemedText>
              <ThemedText style={styles.statsLabel}>CO₂ Tersimpan</ThemedText>
            </View>

            <View style={styles.statsCard}>
              <FontAwesome name="star" size={24} color="#FFD60A" />
              <ThemedText style={styles.statsValue}>{profileData.points}</ThemedText>
              <ThemedText style={styles.statsLabel}>Total Poin</ThemedText>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Pengaturan</ThemedText>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="edit" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Edit Profil</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="bell" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Notifikasi</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="question-circle" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Bantuan</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="info-circle" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Tentang</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.clearDataButton} onPress={handleClearAllData}>
          <View style={styles.clearDataButtonContent}>
            <FontAwesome name="trash" size={20} color="white" />
            <ThemedText style={styles.clearDataButtonText}>Clear All Data (Testing)</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutButtonContent}>
            <FontAwesome name="sign-out" size={20} color="white" />
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 16,
    color: "#6b7280",
  },
  noDataText: {
    marginTop: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: "#3b82f6",
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileEmail: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  profileJoinDate: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  statisticsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  menuSection: {
    marginBottom: 32,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#1f2937",
    marginLeft: 12,
  },
  clearDataButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  clearDataButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearDataButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
