import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  // User data
  const userData = {
    name: "Ahmad Azkia",
    email: "ahmad.azkia@email.com",
    joinDate: "Bergabung sejak Januari 2025",
    totalTrips: 42,
    totalDistance: "120.5 km",
    co2Saved: "30.2 kg",
    points: 1500,
  };

  const handleAccountSettings = () => {
    Alert.alert("Pengaturan Akun", "Fitur pengaturan akun akan segera tersedia");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar dari aplikasi?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Implement logout logic here
          Alert.alert("Logout", "Anda telah berhasil logout");
        },
      },
    ]);
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 60 }} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar and User Info */}
        <View className="items-center mb-10">
          <View className="mb-5">
            <View className="w-24 h-24 bg-blue-50 rounded-full justify-center items-center border-4 border-blue-500">
              <FontAwesome name="user" size={40} color="#007AFF" />
            </View>
          </View>
          <ThemedText className="text-2xl font-bold text-gray-800 mb-2">{userData.name}</ThemedText>
          <ThemedText className="text-base text-gray-600 mb-1">{userData.email}</ThemedText>
          <ThemedText className="text-sm text-gray-400">{userData.joinDate}</ThemedText>
        </View>

        {/* Statistics Summary */}
        <View className="mb-8">
          <ThemedText className="text-xl font-bold text-gray-800 mb-6 text-center">Ringkasan Statistik</ThemedText>

          <View className="flex-row justify-between mb-4">
            {/* Total Perjalanan */}
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-sm">
              <View className="w-12 h-12 bg-blue-50 rounded-full justify-center items-center mb-3">
                <FontAwesome name="bicycle" size={24} color="#007AFF" />
              </View>
              <ThemedText className="text-xs text-gray-600 text-center mb-2">Total Perjalanan</ThemedText>
              <ThemedText className="text-lg font-bold text-gray-800 text-center">{userData.totalTrips}</ThemedText>
            </View>

            {/* Total Jarak */}
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-sm">
              <View className="w-12 h-12 bg-red-50 rounded-full justify-center items-center mb-3">
                <FontAwesome name="road" size={24} color="#FF6B6B" />
              </View>
              <ThemedText className="text-xs text-gray-600 text-center mb-2">Total Jarak</ThemedText>
              <ThemedText className="text-lg font-bold text-gray-800 text-center">{userData.totalDistance}</ThemedText>
            </View>
          </View>

          <View className="flex-row justify-between">
            {/* CO2 Terhemat */}
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-sm">
              <View className="w-12 h-12 bg-green-50 rounded-full justify-center items-center mb-3">
                <FontAwesome name="leaf" size={24} color="#4ECDC4" />
              </View>
              <ThemedText className="text-xs text-gray-600 text-center mb-2">CO2 Terhemat</ThemedText>
              <ThemedText className="text-lg font-bold text-gray-800 text-center">{userData.co2Saved}</ThemedText>
            </View>

            {/* Total Poin */}
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-sm">
              <View className="w-12 h-12 bg-yellow-50 rounded-full justify-center items-center mb-3">
                <FontAwesome name="star" size={24} color="#FFE66D" />
              </View>
              <ThemedText className="text-xs text-gray-600 text-center mb-2">Total Poin</ThemedText>
              <ThemedText className="text-lg font-bold text-gray-800 text-center">{userData.points}</ThemedText>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm" onPress={handleAccountSettings}>
            <View className="w-10 h-10 bg-blue-50 rounded-full justify-center items-center mr-4">
              <FontAwesome name="cog" size={20} color="#007AFF" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-base font-medium text-gray-800">Pengaturan Akun</ThemedText>
              <ThemedText className="text-sm text-gray-500 mt-1">Kelola profil dan preferensi</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#CCCCCC" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm border border-red-200" onPress={handleLogout}>
            <View className="w-10 h-10 bg-red-50 rounded-full justify-center items-center mr-4">
              <FontAwesome name="sign-out" size={20} color="#FF3B30" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-base font-medium text-red-500">Logout</ThemedText>
              <ThemedText className="text-sm text-gray-500 mt-1">Keluar dari aplikasi</ThemedText>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#CCCCCC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
