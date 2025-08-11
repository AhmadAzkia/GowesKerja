import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from "react-native";

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  totalDistance: string;
  position: number;
}

export default function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Minggu Ini");
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("leaderboardData");
      if (storedData) {
        setLeaderboardData(JSON.parse(storedData));
      } else {
        // Default leaderboard data
        const defaultData: LeaderboardUser[] = [
          {
            id: "1",
            name: "Ahmad Rizki",
            points: 3280,
            totalDistance: "125.5 km",
            position: 1,
          },
          {
            id: "2",
            name: "Sarah Chen",
            points: 2450,
            totalDistance: "98.2 km",
            position: 2,
          },
          {
            id: "3",
            name: "Budi Santoso",
            points: 2180,
            totalDistance: "87.3 km",
            position: 3,
          },
          {
            id: "4",
            name: "Dewi Lestari",
            points: 1950,
            totalDistance: "85.3 km",
            position: 4,
          },
          {
            id: "5",
            name: "Andi Wijaya",
            points: 1820,
            totalDistance: "78.9 km",
            position: 5,
          },
        ];
        setLeaderboardData(defaultData);
        await AsyncStorage.setItem("leaderboardData", JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error("Error loading leaderboard data:", error);
      // Fallback data
      setLeaderboardData([
        {
          id: "1",
          name: "Ahmad Rizki",
          points: 3280,
          totalDistance: "125.5 km",
          position: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Ambil top 3 pengguna
  const topThree = leaderboardData.slice(0, 3);

  // Ambil pengguna ranking 4 ke bawah
  const remainingRankings = leaderboardData.slice(3);

  const filters = ["Minggu Ini", "Bulan Ini", "Semua"];

  const renderFilterButton = (filter: string) => (
    <TouchableOpacity key={filter} className={`py-2 px-4 rounded-full mr-3 ${selectedFilter === filter ? "bg-blue-500" : "bg-white border border-gray-300"}`} onPress={() => setSelectedFilter(filter)}>
      <ThemedText className={`font-medium ${selectedFilter === filter ? "text-white" : "text-gray-600"}`}>{filter}</ThemedText>
    </TouchableOpacity>
  );

  const renderPodiumItem = (user: LeaderboardUser) => {
    const isWinner = user.position === 1;
    const avatarSize = isWinner ? 60 : 50;
    const containerHeight = isWinner ? 160 : 150;

    return (
      <View key={user.id} className="flex-1 items-center mx-2" style={{ height: containerHeight }}>
        <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mb-2">
          <ThemedText className="text-white text-xs font-bold">{user.position}</ThemedText>
        </View>
        <View className="rounded-full items-center justify-center mb-3 bg-blue-50" style={{ width: avatarSize, height: avatarSize }}>
          <FontAwesome name="user-circle" size={avatarSize * 0.8} color={isWinner ? "#FFD700" : "#007AFF"} />
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

  const renderRankingItem = ({ item }: { item: LeaderboardUser }) => (
    <View className="flex-row items-center justify-between py-4 px-5 bg-white rounded-2xl">
      <View className="flex-row items-center flex-1">
        <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
          <ThemedText className="text-sm font-semibold text-gray-700">{item.position}</ThemedText>
        </View>
        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
          <FontAwesome name="user-circle" size={20} color="#007AFF" />
        </View>
        <View className="flex-1">
          <ThemedText className="font-semibold text-gray-800 mb-1" numberOfLines={1}>
            {item.name}
          </ThemedText>
          <ThemedText className="text-xs text-gray-500">{item.totalDistance} total jarak</ThemedText>
        </View>
      </View>
      <View className="items-end">
        <ThemedText className="text-sm font-semibold text-blue-600 mb-1">{item.points.toLocaleString()} pts</ThemedText>
        <FontAwesome name="chevron-right" size={16} color="#CCCCCC" />
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <ThemedView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText className="text-base text-gray-600 mt-4">Memuat leaderboard...</ThemedText>
      </ThemedView>
    );
  }

  // Empty state
  if (leaderboardData.length === 0) {
    return (
      <ThemedView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <FontAwesome name="trophy" size={48} color="#CCCCCC" />
        <ThemedText className="text-lg font-medium text-gray-800 mt-4 text-center">Belum ada data leaderboard</ThemedText>
        <ThemedText className="text-sm text-gray-600 mt-2 text-center">Jadilah yang pertama dengan mengumpulkan poin!</ThemedText>
      </ThemedView>
    );
  }

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
        {topThree.length > 0 && (
          <View className="mb-8">
            <ThemedText className="text-lg font-bold text-gray-800 mb-4 text-center">Top 3 Peringkat</ThemedText>
            <View className="flex-row justify-center items-end bg-white rounded-2xl p-6 shadow-sm">{topThree.map(renderPodiumItem)}</View>
          </View>
        )}

        {/* Rankings List Section */}
        {remainingRankings.length > 0 && (
          <View>
            <ThemedText className="text-lg font-bold text-gray-800 mb-4">Peringkat Lainnya</ThemedText>
            <FlatList data={remainingRankings} renderItem={renderRankingItem} keyExtractor={(item) => item.id} scrollEnabled={false} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View className="h-3" />} />
          </View>
        )}

        {/* Show all users if less than 4 */}
        {leaderboardData.length > 0 && leaderboardData.length <= 3 && (
          <View>
            <ThemedText className="text-lg font-bold text-gray-800 mb-4">Semua Pengguna</ThemedText>
            <FlatList data={leaderboardData} renderItem={renderRankingItem} keyExtractor={(item) => item.id} scrollEnabled={false} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View className="h-3" />} />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
