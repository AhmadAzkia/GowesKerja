import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock data service yang akan mudah diganti dengan Firebase
export interface TripData {
  id: string;
  date: string;
  time: string;
  route: string;
  distance: string;
  duration: string;
  points: number;
  userId?: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  totalDistance: string;
  position: number;
}

export interface RouteData {
  id: string;
  name: string;
  distance: string;
  elevation: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
}

export class MockDataService {
  // Storage keys
  private static TRIP_HISTORY_KEY = "tripHistory";
  private static LEADERBOARD_KEY = "leaderboard";
  private static ROUTES_KEY = "popularRoutes";

  // Initialize default data if not exists
  static async initializeData(shouldAddSampleData: boolean = false) {
    try {
      // Initialize trip history if empty
      const tripHistory = await AsyncStorage.getItem(this.TRIP_HISTORY_KEY);
      if (!tripHistory) {
        if (shouldAddSampleData) {
          // Add sample trips for demonstration (hanya jika diminta)
          const sampleTrips: TripData[] = [
            {
              id: "1",
              date: "2025-08-12",
              time: "07:30",
              route: "Rumah - Kantor",
              distance: "5.2 km",
              duration: "18 menit",
              points: 75,
              userId: "sample_user",
            },
            {
              id: "2",
              date: "2025-08-11",
              time: "17:45",
              route: "Kantor - GYM",
              distance: "2.8 km",
              duration: "12 menit",
              points: 40,
              userId: "sample_user",
            },
          ];
          await AsyncStorage.setItem(this.TRIP_HISTORY_KEY, JSON.stringify(sampleTrips));
        } else {
          // Default: empty array untuk user baru
          await AsyncStorage.setItem(this.TRIP_HISTORY_KEY, JSON.stringify([]));
        }
      }

      // Initialize leaderboard if empty
      const leaderboard = await AsyncStorage.getItem(this.LEADERBOARD_KEY);
      if (!leaderboard) {
        if (shouldAddSampleData) {
          // Add sample leaderboard for demonstration (hanya jika diminta)
          const sampleLeaderboard: LeaderboardUser[] = [
            {
              id: "user1",
              name: "Ahmad Azkia",
              points: 1250,
              totalDistance: "45.2 km",
              position: 1,
            },
            {
              id: "user2",
              name: "Sarah Chen",
              points: 980,
              totalDistance: "38.6 km",
              position: 2,
            },
            {
              id: "user3",
              name: "Budi Santoso",
              points: 750,
              totalDistance: "29.1 km",
              position: 3,
            },
          ];
          await AsyncStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(sampleLeaderboard));
        } else {
          // Default: empty array untuk kondisi awal
          await AsyncStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify([]));
        }
      }

      // Initialize routes if empty (available routes for selection, not popular routes)
      const routes = await AsyncStorage.getItem(this.ROUTES_KEY);
      if (!routes) {
        const availableRoutes: RouteData[] = [
          {
            id: "1",
            name: "Monas - Bundaran HI",
            distance: "3.2 km",
            elevation: "15 m",
            icon: "building",
            difficulty: "easy",
          },
          {
            id: "2",
            name: "Kemang - Senopati",
            distance: "2.8 km",
            elevation: "8 m",
            icon: "road",
            difficulty: "easy",
          },
          {
            id: "3",
            name: "Sudirman - Thamrin",
            distance: "4.1 km",
            elevation: "12 m",
            icon: "location-arrow",
            difficulty: "medium",
          },
          {
            id: "4",
            name: "Pantai Ancol - Kota Tua",
            distance: "5.5 km",
            elevation: "5 m",
            icon: "ship",
            difficulty: "medium",
          },
        ];
        await AsyncStorage.setItem(this.ROUTES_KEY, JSON.stringify(availableRoutes));
      }
    } catch (error) {
      console.error("Error initializing mock data:", error);
    }
  }

  // Trip History Methods
  static async getUserTripHistory(userId?: string): Promise<TripData[]> {
    try {
      const data = await AsyncStorage.getItem(this.TRIP_HISTORY_KEY);
      if (data) {
        const trips: TripData[] = JSON.parse(data);
        // Filter by userId if provided (for future Firebase integration)
        return userId ? trips.filter((trip) => trip.userId === userId) : trips;
      }
      return [];
    } catch (error) {
      console.error("Error getting trip history:", error);
      return [];
    }
  }

  static async addTrip(trip: Omit<TripData, "id">): Promise<boolean> {
    try {
      const existingTrips = await this.getUserTripHistory();
      const newTrip: TripData = {
        ...trip,
        id: Date.now().toString(),
      };
      const updatedTrips = [newTrip, ...existingTrips];
      await AsyncStorage.setItem(this.TRIP_HISTORY_KEY, JSON.stringify(updatedTrips));
      return true;
    } catch (error) {
      console.error("Error adding trip:", error);
      return false;
    }
  }

  // Leaderboard Methods
  static async getLeaderboard(): Promise<LeaderboardUser[]> {
    try {
      const data = await AsyncStorage.getItem(this.LEADERBOARD_KEY);
      if (data) {
        const leaderboard: LeaderboardUser[] = JSON.parse(data);
        return leaderboard
          .sort((a, b) => b.points - a.points)
          .map((user, index) => ({
            ...user,
            position: index + 1,
          }));
      }
      return [];
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      return [];
    }
  }

  static async updateUserLeaderboard(userId: string, userData: { name: string; points: number; totalDistance: string }): Promise<boolean> {
    try {
      const leaderboard = await this.getLeaderboard();
      const existingUserIndex = leaderboard.findIndex((user) => user.id === userId);

      if (existingUserIndex >= 0) {
        leaderboard[existingUserIndex] = {
          ...leaderboard[existingUserIndex],
          ...userData,
        };
      } else {
        leaderboard.push({
          id: userId,
          position: 0, // Will be calculated when sorting
          ...userData,
        });
      }

      // Sort and update positions
      const sortedLeaderboard = leaderboard.sort((a, b) => b.points - a.points).map((user, index) => ({ ...user, position: index + 1 }));

      await AsyncStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(sortedLeaderboard));
      return true;
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      return false;
    }
  }

  // Routes Methods
  static async getAvailableRoutes(): Promise<RouteData[]> {
    try {
      const data = await AsyncStorage.getItem(this.ROUTES_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Error getting available routes:", error);
      return [];
    }
  }

  // Get popular routes based on actual usage for specific user
  static async getPopularRoutes(userId?: string): Promise<RouteData[]> {
    try {
      // Get trips for specific user or all trips if no userId provided
      const trips = await this.getUserTripHistory(userId);

      console.log(`DEBUG: Total trips found for user ${userId || "all"}:`, trips.length);
      console.log("DEBUG: Trips data:", trips);

      if (trips.length === 0) {
        // No trips yet, return empty array
        console.log("DEBUG: No trips found, returning empty popular routes");
        return [];
      }

      // Count route usage
      const routeUsage: { [key: string]: number } = {};
      trips.forEach((trip) => {
        if (routeUsage[trip.route]) {
          routeUsage[trip.route]++;
        } else {
          routeUsage[trip.route] = 1;
        }
      });

      console.log("DEBUG: Route usage:", routeUsage);

      // Get available routes
      const availableRoutes = await this.getAvailableRoutes();

      // Sort routes by usage and return top popular ones
      const popularRouteNames = Object.entries(routeUsage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4) // Top 4 most popular
        .map(([routeName]) => routeName);

      // Find corresponding route data
      const popularRoutes = availableRoutes.filter((route) => popularRouteNames.includes(route.name));

      console.log("DEBUG: Popular routes result:", popularRoutes);
      return popularRoutes;
    } catch (error) {
      console.error("Error getting popular routes:", error);
      return [];
    }
  }

  // User Statistics
  static async calculateUserStats(userId?: string): Promise<{
    totalTrips: number;
    totalDistance: number;
    co2Saved: number;
    points: number;
  }> {
    try {
      const trips = await this.getUserTripHistory(userId);
      const totalTrips = trips.length;
      const totalPoints = trips.reduce((sum, trip) => sum + trip.points, 0);

      // Calculate total distance (convert from string to number)
      const totalDistanceKm = trips.reduce((sum, trip) => {
        const distanceStr = trip.distance.replace(" km", "");
        return sum + parseFloat(distanceStr);
      }, 0);

      // Estimate CO2 saved (average 0.25 kg CO2 per km)
      const co2SavedKg = totalDistanceKm * 0.25;

      return {
        totalTrips,
        totalDistance: totalDistanceKm,
        co2Saved: co2SavedKg,
        points: totalPoints,
      };
    } catch (error) {
      console.error("Error calculating user stats:", error);
      return {
        totalTrips: 0,
        totalDistance: 0,
        co2Saved: 0,
        points: 0,
      };
    }
  }

  // Clear all data (for testing)
  static async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([this.TRIP_HISTORY_KEY, this.LEADERBOARD_KEY, this.ROUTES_KEY]);
      console.log("All data cleared from AsyncStorage");
      return true;
    } catch (error) {
      console.error("Error clearing data:", error);
      return false;
    }
  }

  // Debug method to see what's in storage
  static async debugStorage(): Promise<void> {
    try {
      const tripHistory = await AsyncStorage.getItem(this.TRIP_HISTORY_KEY);
      const leaderboard = await AsyncStorage.getItem(this.LEADERBOARD_KEY);
      const routes = await AsyncStorage.getItem(this.ROUTES_KEY);

      console.log("=== ASYNC STORAGE DEBUG ===");
      console.log("Trip History:", tripHistory ? JSON.parse(tripHistory) : "Empty");
      console.log("Leaderboard:", leaderboard ? JSON.parse(leaderboard) : "Empty");
      console.log("Routes:", routes ? JSON.parse(routes) : "Empty");
      console.log("=== END DEBUG ===");
    } catch (error) {
      console.error("Error debugging storage:", error);
    }
  }

  // Initialize new user with empty data
  static async initializeNewUser(userId: string): Promise<boolean> {
    try {
      // Untuk user baru, pastikan mereka mulai dengan data kosong
      // Tidak perlu menambahkan apapun ke trip history karena sudah kosong by default

      // Pastikan user tidak ada di leaderboard sampai mereka punya trip pertama
      const leaderboard = await this.getLeaderboard();
      const userExists = leaderboard.find((user) => user.id === userId);

      if (!userExists) {
        // User baru, tidak perlu ditambahkan ke leaderboard sampai ada trip
        console.log(`New user ${userId} initialized with empty data`);
      }

      return true;
    } catch (error) {
      console.error("Error initializing new user:", error);
      return false;
    }
  }

  // Clear user specific data (untuk testing atau reset akun)
  static async clearUserData(userId: string): Promise<boolean> {
    try {
      // Hapus trips user
      const allTrips = await AsyncStorage.getItem(this.TRIP_HISTORY_KEY);
      if (allTrips) {
        const trips: TripData[] = JSON.parse(allTrips);
        const filteredTrips = trips.filter((trip) => trip.userId !== userId);
        await AsyncStorage.setItem(this.TRIP_HISTORY_KEY, JSON.stringify(filteredTrips));
      }

      // Hapus user dari leaderboard
      const leaderboard = await this.getLeaderboard();
      const filteredLeaderboard = leaderboard.filter((user) => user.id !== userId);
      await AsyncStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(filteredLeaderboard));

      return true;
    } catch (error) {
      console.error("Error clearing user data:", error);
      return false;
    }
  }

  // Add sample trip for testing (hanya untuk development/testing)
  static async addSampleTrip(userId: string): Promise<boolean> {
    const sampleTrip: Omit<TripData, "id"> = {
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      route: "Sample Route - Test Journey",
      distance: "3.5 km",
      duration: "15 menit",
      points: 50,
      userId: userId,
    };

    return await this.addTrip(sampleTrip);
  }
}
