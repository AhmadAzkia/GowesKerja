import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";

interface TripData {
  id: string;
  date: string;
  time: string;
  route: string;
  distance: string;
  duration: string;
  points: number;
}

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<TripData[]>([]);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("tripHistory");
      if (storedData) {
        setHistoryData(JSON.parse(storedData));
      } else {
        // Default trip history data
        const defaultData: TripData[] = [
          {
            id: "1",
            date: "2025-08-07",
            time: "14:30",
            route: "Monas - Bundaran HI",
            distance: "3.2 km",
            duration: "12 menit",
            points: 45,
          },
          {
            id: "2",
            date: "2025-08-06",
            time: "08:15",
            route: "Kemang - Senopati",
            distance: "2.8 km",
            duration: "10 menit",
            points: 38,
          },
          {
            id: "3",
            date: "2025-08-05",
            time: "17:45",
            route: "Sudirman - Thamrin",
            distance: "4.1 km",
            duration: "15 menit",
            points: 52,
          },
          {
            id: "4",
            date: "2025-08-04",
            time: "09:30",
            route: "Pantai Ancol - Kota Tua",
            distance: "5.5 km",
            duration: "20 menit",
            points: 68,
          },
          {
            id: "5",
            date: "2025-08-03",
            time: "16:20",
            route: "Blok M - Fatmawati",
            distance: "2.1 km",
            duration: "8 menit",
            points: 28,
          },
        ];
        setHistoryData(defaultData);
        await AsyncStorage.setItem("tripHistory", JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error("Error loading trip history:", error);
      // Fallback data
      setHistoryData([
        {
          id: "1",
          date: "2025-08-07",
          time: "14:30",
          route: "Monas - Bundaran HI",
          distance: "3.2 km",
          duration: "12 menit",
          points: 45,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function untuk format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const renderHistoryItem = ({ item }: { item: TripData }) => (
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
          <ThemedText className="text-base font-semibold text-gray-800">{formatDate(item.date)}</ThemedText>
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

  // Loading state
  if (loading) {
    return (
      <ThemedView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText className="text-base text-gray-600 mt-4">Memuat riwayat perjalanan...</ThemedText>
      </ThemedView>
    );
  }

  // Empty state
  if (historyData.length === 0) {
    return (
      <ThemedView className="flex-1 bg-gray-50">
        <View className="px-5 pt-16 pb-4">
          <ThemedText type="title" className="mb-2">
            Riwayat Perjalanan
          </ThemedText>
          <ThemedText className="text-sm text-gray-600">Total 0 perjalanan</ThemedText>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <FontAwesome name="bicycle" size={48} color="#CCCCCC" />
          <ThemedText className="text-lg font-medium text-gray-800 mt-4 text-center">Belum ada perjalanan</ThemedText>
          <ThemedText className="text-sm text-gray-600 mt-2 text-center">Mulai perjalanan pertama Anda untuk melihat riwayat di sini</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <View className="px-5 pt-16 pb-4">
        <ThemedText type="title" className="mb-2">
          Riwayat Perjalanan
        </ThemedText>
        <ThemedText className="text-sm text-gray-600">Total {historyData.length} perjalanan</ThemedText>
      </View>

      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </ThemedView>
  );
}
