import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { auth } from "../../config/firebase";
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const loadProfileData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get user data from Firebase instead of AsyncStorage
      const stats = await MockDataService.calculateUserStats(user?.uid);

      // Ensure stats are valid numbers/strings before using
      const userData: ProfileData = {
        name: user.displayName || "User",
        email: user.email || "user@example.com",
        joinDate: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        totalTrips: typeof stats.totalTrips === "number" ? stats.totalTrips : 0,
        totalDistance: typeof stats.totalDistance === "string" ? stats.totalDistance : "0 km",
        co2Saved: typeof stats.co2Saved === "string" ? stats.co2Saved : "0 kg",
        points: typeof stats.totalPoints === "number" ? stats.totalPoints : 0,
      };
      setProfileData(userData);
    } catch (error) {
      console.error("Error updating profile stats:", error);
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
  }, [user]);

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
            // Sign out from Firebase auth
            await signOut(auth);
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

  const showAboutDialog = () => {
    Alert.alert(
      "🚴‍♂️ Tentang GowesKerja",
      "Dibuat oleh Ahmad Azkia, mahasiswa Teknik Informatika Universitas Komputer Indonesia.\n\n" +
        "Aplikasi ini dibuat untuk memenuhi tugas mata kuliah Pemrograman Android.\n\n" +
        "🌟 Fitur Utama:\n" +
        "• Tracking perjalanan sepeda dengan GPS\n" +
        "• Sistem poin dan reward\n" +
        "• Kalkulasi CO2 yang dihemat\n" +
        "• Leaderboard kompetitif\n" +
        "• Riwayat perjalanan\n\n" +
        "💚 Mari bersama-sama berkontribusi untuk lingkungan yang lebih bersih dengan bersepeda!\n\n" +
        "Versi 1.0.0 - 2025",
      [{ text: "OK", style: "default" }]
    );
  };

  const showHelpDialog = () => {
    Alert.alert(
      "🆘 Bantuan & FAQ",
      "📍 Cara Memulai Perjalanan:\n" +
        "1. Tap 'Mulai Perjalanan' di beranda\n" +
        "2. Pilih atau cari tujuan Anda\n" +
        "3. Tap 'Mulai Tracking' untuk memulai\n" +
        "4. Bersepeda menuju tujuan Anda\n" +
        "5. Tracking otomatis berhenti saat tiba\n\n" +
        "⭐ Sistem Poin:\n" +
        "• 1 poin = 100 meter perjalanan\n" +
        "• Poin bertambah otomatis saat tracking\n" +
        "• Lihat ranking di tab Leaderboard\n\n" +
        "🚴‍♂️ Tips Bersepeda Aman:\n" +
        "• Selalu gunakan helm\n" +
        "• Perhatikan kondisi jalan\n" +
        "• Jaga jarak aman dengan kendaraan\n" +
        "• Gunakan jalur sepeda jika tersedia\n\n" +
        "❓ Masalah Umum:\n" +
        "• GPS tidak akurat? Pastikan izin lokasi aktif\n" +
        "• Tracking berhenti? Periksa koneksi internet\n" +
        "• Poin tidak bertambah? Restart tracking\n\n" +
        "📧 Butuh bantuan lebih lanjut?\n" +
        "Kontak: ahmadazkia5@gmail.com",
      [{ text: "OK", style: "default" }]
    );
  };

  const showComingSoonDialog = (featureName: string) => {
    Alert.alert(
      "🚧 Coming Soon",
      `Fitur ${featureName} sedang dalam pengembangan dan akan tersedia di versi mendatang!\n\n` +
        "🌟 Yang akan datang:\n" +
        "• Edit profil lengkap dengan foto\n" +
        "• Notifikasi achievement dan reminder\n" +
        "• Pengaturan preferensi personal\n" +
        "• Dan fitur menarik lainnya!\n\n" +
        "📱 Stay tuned untuk update selanjutnya!",
      [{ text: "OK", style: "default" }]
    );
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

          <TouchableOpacity style={styles.menuItem} onPress={() => showComingSoonDialog("Edit Profil")}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="edit" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Edit Profil</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => showComingSoonDialog("Notifikasi")}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="bell" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Notifikasi</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={showHelpDialog}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="question-circle" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Bantuan</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={showAboutDialog}>
            <View style={styles.menuItemContent}>
              <FontAwesome name="info-circle" size={20} color="#007AFF" />
              <ThemedText style={styles.menuItemText}>Tentang</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
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
