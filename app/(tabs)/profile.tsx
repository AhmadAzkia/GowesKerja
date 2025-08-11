import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from "react-native";

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

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        setProfileData(JSON.parse(storedData));
      } else {
        // Default profile data
        const defaultData: ProfileData = {
          name: "Ahmad Azkia",
          email: "ahmad.azkia@example.com",
          joinDate: "10 Agustus 2025",
          totalTrips: 15,
          totalDistance: "45.3 km",
          co2Saved: "12.5 kg",
          points: 1250,
        };
        setProfileData(defaultData);
        await AsyncStorage.setItem("userData", JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      // Fallback data
      setProfileData({
        name: "User",
        email: "user@example.com",
        joinDate: "Hari ini",
        totalTrips: 0,
        totalDistance: "0 km",
        co2Saved: "0 kg",
        points: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("userSession");
            router.replace("/(tabs)/login");
          },
        },
      ]);
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Gagal logout");
    }
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText className="mt-4 text-gray-600">Memuat profil...</ThemedText>
      </ThemedView>
    );
  }

  if (!profileData) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <FontAwesome name="user-times" size={64} color="#999" />
        <ThemedText className="mt-4 text-gray-600 text-center">Tidak ada data profil yang tersedia</ThemedText>
        <TouchableOpacity className="mt-4 bg-blue-500 px-6 py-3 rounded-lg" onPress={() => router.push("/(tabs)/login")}>
          <ThemedText className="text-white font-semibold">Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header Profile */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-500 rounded-full justify-center items-center mb-4">
            <FontAwesome name="user" size={40} color="white" />
          </View>
          <ThemedText className="text-2xl font-bold text-gray-800">{profileData.name}</ThemedText>
          <ThemedText className="text-base text-gray-600 mt-1">{profileData.email}</ThemedText>
          <ThemedText className="text-sm text-gray-500 mt-1">Bergabung {profileData.joinDate}</ThemedText>
        </View>

        {/* Statistics Cards */}
        <View className="mb-8">
          <ThemedText className="text-lg font-bold text-gray-800 mb-4">Statistik Saya</ThemedText>

          <View className="flex-row justify-between mb-4">
            <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm">
              <FontAwesome name="bicycle" size={24} color="#007AFF" />
              <ThemedText className="text-2xl font-bold text-gray-800 mt-2">{profileData.totalTrips}</ThemedText>
              <ThemedText className="text-sm text-gray-600">Total Perjalanan</ThemedText>
            </View>

            <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm">
              <FontAwesome name="road" size={24} color="#34C759" />
              <ThemedText className="text-2xl font-bold text-gray-800 mt-2">{profileData.totalDistance}</ThemedText>
              <ThemedText className="text-sm text-gray-600">Jarak Tempuh</ThemedText>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm">
              <FontAwesome name="leaf" size={24} color="#32D74B" />
              <ThemedText className="text-2xl font-bold text-gray-800 mt-2">{profileData.co2Saved}</ThemedText>
              <ThemedText className="text-sm text-gray-600">CO₂ Tersimpan</ThemedText>
            </View>

            <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm">
              <FontAwesome name="star" size={24} color="#FFD60A" />
              <ThemedText className="text-2xl font-bold text-gray-800 mt-2">{profileData.points}</ThemedText>
              <ThemedText className="text-sm text-gray-600">Total Poin</ThemedText>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View className="mb-8">
          <ThemedText className="text-lg font-bold text-gray-800 mb-4">Pengaturan</ThemedText>

          <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow-sm">
            <View className="flex-row items-center">
              <FontAwesome name="edit" size={20} color="#007AFF" />
              <ThemedText className="text-base text-gray-800 ml-3">Edit Profil</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow-sm">
            <View className="flex-row items-center">
              <FontAwesome name="bell" size={20} color="#007AFF" />
              <ThemedText className="text-base text-gray-800 ml-3">Notifikasi</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow-sm">
            <View className="flex-row items-center">
              <FontAwesome name="question-circle" size={20} color="#007AFF" />
              <ThemedText className="text-base text-gray-800 ml-3">Bantuan</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow-sm">
            <View className="flex-row items-center">
              <FontAwesome name="info-circle" size={20} color="#007AFF" />
              <ThemedText className="text-base text-gray-800 ml-3">Tentang</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity className="bg-red-500 rounded-2xl p-4 items-center mb-8" onPress={handleLogout}>
          <View className="flex-row items-center">
            <FontAwesome name="sign-out" size={20} color="white" />
            <ThemedText className="text-white text-base font-semibold ml-2">Logout</ThemedText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}
