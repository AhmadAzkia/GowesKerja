import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

export default function HistoryScreen() {
  // Dummy data for journey history
  const journeyHistory = [
    {
      id: "1",
      date: "07 Agustus 2025",
      time: "14:30",
      route: "Monas - Bundaran HI",
      distance: "3.2 km",
      duration: "12 menit",
      mapImage: "map1", // Static map placeholder
      points: 45,
    },
    {
      id: "2",
      date: "06 Agustus 2025",
      time: "08:15",
      route: "Kemang - Senopati",
      distance: "2.8 km",
      duration: "10 menit",
      mapImage: "map2",
      points: 38,
    },
    {
      id: "3",
      date: "05 Agustus 2025",
      time: "17:45",
      route: "Sudirman - Thamrin",
      distance: "4.1 km",
      duration: "15 menit",
      mapImage: "map3",
      points: 52,
    },
    {
      id: "4",
      date: "04 Agustus 2025",
      time: "09:30",
      route: "Pantai Ancol - Kota Tua",
      distance: "5.5 km",
      duration: "20 menit",
      mapImage: "map4",
      points: 68,
    },
    {
      id: "5",
      date: "03 Agustus 2025",
      time: "16:20",
      route: "Blok M - Fatmawati",
      distance: "2.1 km",
      duration: "8 menit",
      mapImage: "map5",
      points: 28,
    },
    {
      id: "6",
      date: "02 Agustus 2025",
      time: "07:45",
      route: "Cikini - Menteng",
      distance: "1.8 km",
      duration: "7 menit",
      mapImage: "map6",
      points: 25,
    },
  ];

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Map placeholder */}
      <View className="mb-4">
        <View className="h-32 bg-blue-50 rounded-xl justify-center items-center border border-gray-200">
          <FontAwesome name="map" size={24} color="#007AFF" />
          <ThemedText className="text-xs text-blue-500 mt-1">Peta Rute</ThemedText>
        </View>
      </View>

      {/* Journey details */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-2">
          <ThemedText className="text-base font-semibold text-gray-800">{item.date}</ThemedText>
          <ThemedText className="text-sm text-gray-600">{item.time}</ThemedText>
        </View>

        <ThemedText className="text-sm font-medium text-gray-700 mb-3">{item.route}</ThemedText>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <FontAwesome name="road" size={14} color="#666666" />
            <ThemedText className="text-xs text-gray-600 font-medium">{item.distance}</ThemedText>
          </View>
          <View className="flex-row items-center gap-2">
            <FontAwesome name="clock-o" size={14} color="#666666" />
            <ThemedText className="text-xs text-gray-600 font-medium">{item.duration}</ThemedText>
          </View>
          <View className="flex-row items-center gap-2">
            <FontAwesome name="star" size={14} color="#FFE66D" />
            <ThemedText className="text-xs text-gray-600 font-medium">{item.points} poin</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <View className="px-5 pt-16 pb-4">
        <ThemedText type="title" className="mb-2">
          Riwayat Perjalanan
        </ThemedText>
        <ThemedText className="text-sm text-gray-600">Total {journeyHistory.length} perjalanan</ThemedText>
      </View>

      <FlatList
        data={journeyHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </ThemedView>
  );
}
