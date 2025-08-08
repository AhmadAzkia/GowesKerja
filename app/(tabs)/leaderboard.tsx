import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";

export default function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Minggu Ini");

  // Dummy data for top 3 winners
  const topThree = [
    {
      id: 2,
      name: "Sarah Chen",
      points: 2450,
      position: 2,
      avatar: "user-circle",
    },
    {
      id: 1,
      name: "Ahmad Rizki",
      points: 3280,
      position: 1,
      avatar: "user-circle",
    },
    {
      id: 3,
      name: "Budi Santoso",
      points: 2180,
      position: 3,
      avatar: "user-circle",
    },
  ];

  // Dummy data for remaining rankings (4th place and below)
  const remainingRankings = [
    {
      id: 4,
      name: "Dewi Lestari",
      distance: "85.3 km",
      position: 4,
      avatar: "user-circle",
    },
    {
      id: 5,
      name: "Andi Wijaya",
      distance: "78.9 km",
      position: 5,
      avatar: "user-circle",
    },
    {
      id: 6,
      name: "Siti Nurhaliza",
      distance: "72.1 km",
      position: 6,
      avatar: "user-circle",
    },
    {
      id: 7,
      name: "Rudi Hartono",
      distance: "68.5 km",
      position: 7,
      avatar: "user-circle",
    },
    {
      id: 8,
      name: "Maya Sari",
      distance: "65.2 km",
      position: 8,
      avatar: "user-circle",
    },
    {
      id: 9,
      name: "Dimas Pratama",
      distance: "61.8 km",
      position: 9,
      avatar: "user-circle",
    },
    {
      id: 10,
      name: "Lina Kusuma",
      distance: "58.4 km",
      position: 10,
      avatar: "user-circle",
    },
  ];

  const filters = ["Minggu Ini", "Bulan Ini", "Semua"];

  const renderFilterButton = (filter: string) => (
    <TouchableOpacity key={filter} className={`py-2 px-4 rounded-full mr-3 ${selectedFilter === filter ? "bg-blue-500" : "bg-white border border-gray-300"}`} onPress={() => setSelectedFilter(filter)}>
      <ThemedText className={`font-medium ${selectedFilter === filter ? "text-white" : "text-gray-600"}`}>{filter}</ThemedText>
    </TouchableOpacity>
  );

  const renderPodiumItem = (user: any) => {
    const isWinner = user.position === 1;
    const avatarSize = isWinner ? 60 : 50;
    const containerHeight = isWinner ? 160 : 150;

    return (
      <View key={user.id} className="flex-1 items-center mx-2" style={{ height: containerHeight }}>
        <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mb-2">
          <ThemedText className="text-white text-xs font-bold">{user.position}</ThemedText>
        </View>
        <View className="rounded-full items-center justify-center mb-3 bg-blue-50" style={{ width: avatarSize, height: avatarSize }}>
          <FontAwesome name={user.avatar} size={avatarSize * 0.8} color={isWinner ? "#FFD700" : "#007AFF"} />
        </View>
        <ThemedText className={`text-center font-semibold mb-1 ${isWinner ? "text-base text-yellow-600" : "text-sm text-gray-800"}`} numberOfLines={2} ellipsizeMode="tail">
          {user.name}
        </ThemedText>
        <ThemedText className={`text-center ${isWinner ? "text-sm font-bold text-yellow-600" : "text-xs text-gray-600"}`} numberOfLines={1}>
          {user.points.toLocaleString()} pts
        </ThemedText>
      </View>
    );
  };

  const renderRankingItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between py-4 px-5 bg-white rounded-2xl">
      <View className="flex-row items-center flex-1">
        <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
          <ThemedText className="text-sm font-semibold text-gray-700">{item.position}</ThemedText>
        </View>
        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
          <FontAwesome name={item.avatar} size={20} color="#007AFF" />
        </View>
        <View className="flex-1">
          <ThemedText className="font-semibold text-gray-800 mb-1" numberOfLines={1}>
            {item.name}
          </ThemedText>
          <ThemedText className="text-xs text-gray-500">{item.distance} total jarak</ThemedText>
        </View>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#CCCCCC" />
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        {/* Header */}
        <ThemedText type="title" className="mb-6">
          Leaderboard
        </ThemedText>

        {/* Filter Buttons */}
        <View className="flex-row mb-8">{filters.map(renderFilterButton)}</View>

        {/* Podium Section */}
        <View className="mb-8">
          <ThemedText className="text-lg font-bold text-gray-800 mb-4 text-center">Top 3 Peringkat</ThemedText>
          <View className="flex-row justify-center items-end bg-white rounded-2xl p-6 shadow-sm">{topThree.map(renderPodiumItem)}</View>
        </View>

        {/* Rankings List Section */}
        <View>
          <ThemedText className="text-lg font-bold text-gray-800 mb-4">Peringkat Lainnya</ThemedText>
          <FlatList data={remainingRankings} renderItem={renderRankingItem} keyExtractor={(item) => item.id.toString()} scrollEnabled={false} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View className="h-3" />} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
