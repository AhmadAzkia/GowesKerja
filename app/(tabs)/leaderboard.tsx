import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { LeaderboardUser, MockDataService } from "../../services/mockDataService";

export default function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Minggu Ini");
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  const loadLeaderboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await MockDataService.getLeaderboard();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error loading leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  // Ambil top 3 pengguna
  const topThree = leaderboardData.slice(0, 3);

  // Ambil pengguna ranking 4 ke bawah
  const remainingRankings = leaderboardData.slice(3);

  const filters = ["Minggu Ini", "Bulan Ini", "Semua"];

  const renderFilterButton = (filter: string) => (
    <TouchableOpacity key={filter} style={[styles.filterButton, selectedFilter === filter ? styles.filterButtonActive : styles.filterButtonInactive]} onPress={() => setSelectedFilter(filter)}>
      <ThemedText style={[styles.filterButtonText, selectedFilter === filter ? styles.filterButtonTextActive : styles.filterButtonTextInactive]}>{filter}</ThemedText>
    </TouchableOpacity>
  );

  const renderPodiumItem = (user: LeaderboardUser) => {
    const isWinner = user.position === 1;
    const avatarSize = isWinner ? 60 : 50;
    const containerHeight = isWinner ? 160 : 150;

    return (
      <View key={user.id} style={[styles.podiumItem, { height: containerHeight }]}>
        <View style={styles.positionBadge}>
          <ThemedText style={styles.positionText}>{user.position}</ThemedText>
        </View>
        <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
          <FontAwesome name="user-circle" size={avatarSize * 0.8} color={isWinner ? "#FFD700" : "#007AFF"} />
        </View>
        <ThemedText style={[styles.podiumName, isWinner ? styles.podiumNameWinner : styles.podiumNameRegular]} numberOfLines={2} ellipsizeMode="tail">
          {user.name}
        </ThemedText>
        <ThemedText style={[styles.podiumPoints, isWinner ? styles.podiumPointsWinner : styles.podiumPointsRegular]} numberOfLines={1}>
          {user.points.toLocaleString()} pts
        </ThemedText>
      </View>
    );
  };

  const renderRankingItem = ({ item }: { item: LeaderboardUser }) => (
    <View style={styles.rankingCard}>
      <View style={styles.rankingLeft}>
        <View style={styles.rankingPosition}>
          <ThemedText style={styles.rankingPositionText}>{item.position}</ThemedText>
        </View>
        <View style={styles.rankingAvatar}>
          <FontAwesome name="user-circle" size={20} color="#007AFF" />
        </View>
        <View style={styles.rankingInfo}>
          <ThemedText style={styles.rankingName} numberOfLines={1}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.rankingDistance}>{item.totalDistance} total jarak</ThemedText>
        </View>
      </View>
      <View style={styles.rankingRight}>
        <ThemedText style={styles.rankingPoints}>{item.points.toLocaleString()} pts</ThemedText>
        <FontAwesome name="chevron-right" size={16} color="#CCCCCC" />
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Memuat leaderboard...</ThemedText>
      </ThemedView>
    );
  }

  // Empty state
  if (leaderboardData.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <FontAwesome name="trophy" size={48} color="#CCCCCC" />
        <ThemedText style={styles.emptyTitle}>Belum ada data leaderboard</ThemedText>
        <ThemedText style={styles.emptySubtitle}>Jadilah yang pertama dengan mengumpulkan poin!</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <ThemedText type="title" style={styles.title}>
          Leaderboard
        </ThemedText>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>{filters.map(renderFilterButton)}</View>

        {/* Podium Section */}
        {topThree.length > 0 && (
          <View style={styles.podiumSection}>
            <ThemedText style={styles.sectionTitle}>Top 3 Peringkat</ThemedText>
            <View style={styles.podiumContainer}>{topThree.map(renderPodiumItem)}</View>
          </View>
        )}

        {/* Rankings List Section */}
        {remainingRankings.length > 0 && (
          <View>
            <ThemedText style={styles.sectionTitle}>Peringkat Lainnya</ThemedText>
            <FlatList data={remainingRankings} renderItem={renderRankingItem} keyExtractor={(item) => item.id} scrollEnabled={false} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View style={styles.separator} />} />
          </View>
        )}

        {/* Show all users if less than 4 */}
        {leaderboardData.length > 0 && leaderboardData.length <= 3 && (
          <View>
            <ThemedText style={styles.sectionTitle}>Semua Pengguna</ThemedText>
            <FlatList data={leaderboardData} renderItem={renderRankingItem} keyExtractor={(item) => item.id} scrollEnabled={false} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View style={styles.separator} />} />
          </View>
        )}
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
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 32,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
  },
  filterButtonInactive: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  filterButtonText: {
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "white",
  },
  filterButtonTextInactive: {
    color: "#6b7280",
  },
  podiumSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  podiumItem: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  positionBadge: {
    width: 24,
    height: 24,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  positionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  avatarContainer: {
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#eff6ff",
  },
  podiumName: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 4,
  },
  podiumNameWinner: {
    fontSize: 16,
    color: "#d97706",
  },
  podiumNameRegular: {
    fontSize: 14,
    color: "#1f2937",
  },
  podiumPoints: {
    textAlign: "center",
  },
  podiumPointsWinner: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d97706",
  },
  podiumPointsRegular: {
    fontSize: 12,
    color: "#6b7280",
  },
  rankingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 16,
  },
  rankingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rankingPosition: {
    width: 32,
    height: 32,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankingPositionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  rankingAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  rankingDistance: {
    fontSize: 12,
    color: "#9ca3af",
  },
  rankingRight: {
    alignItems: "flex-end",
  },
  rankingPoints: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: 4,
  },
  separator: {
    height: 12,
  },
});
