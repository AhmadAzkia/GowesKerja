import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { auth } from "../../config/firebase";

export default function HomeScreen() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Jika masih loading, tampilkan loading
  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText className="mt-4 text-gray-600">Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Jika user belum login, redirect ke login
  if (!user) {
    return <Redirect href="/(tabs)/login" />;
  }

  // Dummy data for popular routes
  const popularRoutes = [
    {
      id: "1",
      name: "Monas - Bundaran HI",
      distance: "3.2 km",
      elevation: "15 m",
      icon: "building",
    },
    {
      id: "2",
      name: "Kemang - Senopati",
      distance: "2.8 km",
      elevation: "8 m",
      icon: "road",
    },
    {
      id: "3",
      name: "Sudirman - Thamrin",
      distance: "4.1 km",
      elevation: "12 m",
      icon: "location-arrow",
    },
    {
      id: "4",
      name: "Pantai Ancol - Kota Tua",
      distance: "5.5 km",
      elevation: "5 m",
      icon: "ship",
    },
  ];

  const renderRouteCard = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white rounded-xl p-4 mr-4 w-44 shadow-sm">
      <View className="w-12 h-12 bg-blue-50 rounded-full justify-center items-center mb-3">
        <FontAwesome name={item.icon} size={24} color="#007AFF" />
      </View>
      <ThemedText className="text-base font-semibold text-gray-800 mb-3 leading-5">{item.name}</ThemedText>
      <View className="flex-col gap-2">
        <View className="flex-row items-center gap-2">
          <FontAwesome name="road" size={12} color="#666666" />
          <ThemedText className="text-sm text-gray-600">{item.distance}</ThemedText>
        </View>
        <View className="flex-row items-center gap-2">
          <FontAwesome name="line-chart" size={12} color="#666666" />
          <ThemedText className="text-sm text-gray-600">{item.elevation}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <ThemedText className="text-lg font-semibold">Selamat Pagi, User!</ThemedText>
          <FontAwesome name="bell" size={24} color="#007AFF" />
        </View>

        {/* Cards Section */}
        <View className="flex-row justify-between mb-8">
          {/* Card 1: Total Jarak */}
          <View className="flex-1 bg-white rounded-xl p-4 mx-1 items-center shadow-sm">
            <FontAwesome name="map-marker" size={24} color="#FF6B6B" className="mb-2" />
            <ThemedText className="text-xs text-gray-600 mb-1 text-center">Total Jarak</ThemedText>
            <ThemedText className="text-base font-bold text-gray-800 text-center">120.5 km</ThemedText>
          </View>

          {/* Card 2: CO2 Terhemat */}
          <View className="flex-1 bg-white rounded-xl p-4 mx-1 items-center shadow-sm">
            <FontAwesome name="leaf" size={24} color="#4ECDC4" className="mb-2" />
            <ThemedText className="text-xs text-gray-600 mb-1 text-center">CO2 Terhemat</ThemedText>
            <ThemedText className="text-base font-bold text-gray-800 text-center">30.2 kg</ThemedText>
          </View>

          {/* Card 3: Poin Anda */}
          <View className="flex-1 bg-white rounded-xl p-4 mx-1 items-center shadow-sm">
            <FontAwesome name="star" size={24} color="#FFE66D" className="mb-2" />
            <ThemedText className="text-xs text-gray-600 mb-1 text-center">Poin Anda</ThemedText>
            <ThemedText className="text-base font-bold text-gray-800 text-center">1,500</ThemedText>
          </View>
        </View>

        {/* Start Journey Button */}
        <TouchableOpacity className="bg-blue-500 py-4 px-8 rounded-xl items-center mb-5 shadow-sm">
          <ThemedText className="text-white text-lg font-semibold">Mulai Perjalanan</ThemedText>
        </TouchableOpacity>

        {/* Map Placeholder */}
        <View className="w-full h-72 rounded-xl mb-5 bg-gray-100 border border-gray-300">
          <View className="flex-1 justify-center items-center">
            <FontAwesome name="map" size={40} color="#007AFF" />
            <ThemedText className="text-base font-medium mt-3 text-gray-600">Peta akan dimuat di sini</ThemedText>
            <ThemedText className="text-sm text-gray-500 mt-1">Jakarta, Indonesia</ThemedText>
          </View>
        </View>

        {/* Popular Routes Section */}
        <View className="mb-10">
          <ThemedText className="text-xl font-bold mb-4 text-gray-800">Rute Populer</ThemedText>
          <FlatList data={popularRoutes} renderItem={renderRouteCard} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 0 }} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
