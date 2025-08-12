import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { auth } from "../../config/firebase.mock";
import { MockDataService, TripData } from "../../services/mockDataService";

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<TripData[]>([]);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const loadHistoryData = useCallback(async () => {
    if (!user) {
      setHistoryData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Pass user ID to get only this user's trips
      const trips = await MockDataService.getUserTripHistory(user.uid);
      setHistoryData(trips);
    } catch (error) {
      console.error("Error loading history data:", error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);

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
    <TouchableOpacity style={styles.historyCard}>
      {/* Map placeholder */}
      <View style={styles.mapSection}>
        <View style={styles.mapPlaceholder}>
          <FontAwesome name="map" size={24} color="#007AFF" />
          <ThemedText style={styles.mapText}>Peta Rute</ThemedText>
        </View>
      </View>

      {/* Journey details */}
      <View style={styles.detailsSection}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.dateText}>{formatDate(item.date)}</ThemedText>
          <ThemedText style={styles.timeText}>{item.time}</ThemedText>
        </View>

        <ThemedText style={styles.routeText}>{item.route}</ThemedText>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome name="road" size={14} color="#666666" />
            <ThemedText style={styles.statText}>{item.distance}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="clock-o" size={14} color="#666666" />
            <ThemedText style={styles.statText}>{item.duration}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="star" size={14} color="#FFE66D" />
            <ThemedText style={styles.statText}>{item.points} poin</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Memuat riwayat perjalanan...</ThemedText>
      </ThemedView>
    );
  }

  // Empty state
  if (historyData.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Riwayat Perjalanan
          </ThemedText>
          <ThemedText style={styles.subtitle}>Total 0 perjalanan</ThemedText>
        </View>

        <View style={styles.emptyState}>
          <FontAwesome name="bicycle" size={48} color="#CCCCCC" />
          <ThemedText style={styles.emptyTitle}>Belum ada perjalanan</ThemedText>
          <ThemedText style={styles.emptySubtitle}>Mulai perjalanan pertama Anda untuk melihat riwayat di sini</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Riwayat Perjalanan
        </ThemedText>
        <ThemedText style={styles.subtitle}>Total {historyData.length} perjalanan</ThemedText>
      </View>

      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1f2937",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  separator: {
    height: 16,
  },
  historyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapSection: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 128,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  mapText: {
    fontSize: 12,
    color: "#3b82f6",
    marginTop: 4,
  },
  detailsSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  timeText: {
    fontSize: 14,
    color: "#6b7280",
  },
  routeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
});
