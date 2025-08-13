// Direct Firebase implementation for MockDataService
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { firestore } from "../config/firebase";

// Interface untuk trip data yang kompatibel dengan UI
export interface TripData {
  id: string;
  date: string;
  time: string;
  route: string;
  distance: string;
  duration: string;
  points: number;
  co2Saved?: string;
  userId?: string;
}

// Interface untuk leaderboard yang kompatibel dengan UI
export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  totalDistance: string;
  position: number;
}

// Interface untuk route data
export interface RouteData {
  id: string;
  name: string;
  distance: string;
  elevation: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
}

export class MockDataService {
  // Helper method to format duration from minutes to readable string
  private static formatDurationFromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  // Parse duration string to seconds
  private static parseDuration(durationStr: string): number {
    const hourMatch = durationStr.match(/(\d+)h/);
    const minuteMatch = durationStr.match(/(\d+)m/);

    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;

    return hours * 3600 + minutes * 60;
  }

  // Initialize data - now uses Firebase
  static async initializeData(shouldAddSampleData: boolean = false): Promise<boolean> {
    try {
      if (shouldAddSampleData) {
        console.log("🔥 Firebase is being used - sample data will be managed through Firebase console");
      }
      console.log("✅ MockDataService initialized with Firebase backend");
      return true;
    } catch (error) {
      console.error("❌ Error initializing data service:", error);
      return false;
    }
  }

  // Trip History Methods - simplified to avoid index issues
  static async getTripHistory(userId?: string): Promise<TripData[]> {
    try {
      if (!userId) {
        console.warn("⚠️ No userId provided for getTripHistory");
        return [];
      }

      console.log(`🔥 Getting trip history for user: ${userId}`);

      // Query trips collection with simple where clause (no orderBy to avoid index issues)
      const tripsRef = collection(firestore, "trips");
      const q = query(tripsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const trips: TripData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trips.push({
          id: doc.id,
          date: data.tripDate ? new Date(data.tripDate.toDate()).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID"),
          time: data.tripDate ? new Date(data.tripDate.toDate()).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "00:00",
          route: data.routeName || "Unknown Route",
          distance: `${(data.distanceKm || 0).toFixed(1)} km`,
          duration: this.formatDurationFromMinutes(data.durationMinutes || 0),
          points: data.points || Math.round((data.distanceKm || 0) * 10),
          co2Saved: `${(data.co2SavedKg || 0).toFixed(1)} kg`,
          userId: data.userId,
        });
      });

      // Sort manually by date (newest first)
      trips.sort((a, b) => {
        const dateA = new Date(a.date + " " + a.time);
        const dateB = new Date(b.date + " " + b.time);
        return dateB.getTime() - dateA.getTime();
      });

      console.log(`✅ Successfully loaded ${trips.length} trips for user ${userId}`);
      return trips;
    } catch (error) {
      console.error("❌ Error getting trip history:", error);
      return [];
    }
  }

  // Alias for backward compatibility
  static async getUserTripHistory(userId?: string): Promise<TripData[]> {
    return this.getTripHistory(userId);
  }

  static async addTrip(trip: Omit<TripData, "id">): Promise<boolean> {
    try {
      if (!trip.userId) {
        console.warn("⚠️ No userId provided for addTrip");
        return false;
      }

      // Add trip directly to Firestore
      const tripsRef = collection(firestore, "trips");
      const distanceKm = parseFloat(trip.distance.replace(" km", ""));
      const durationMinutes = this.parseDuration(trip.duration) / 60; // Convert seconds to minutes
      const co2SavedKg = distanceKm * 0.25; // 0.25kg CO2 per km

      const newTrip = {
        userId: trip.userId,
        tripDate: serverTimestamp(),
        distanceKm: distanceKm,
        durationMinutes: durationMinutes,
        points: trip.points,
        routeId: `route_${Date.now()}`,
        routeName: trip.route,
        co2SavedKg: co2SavedKg,
        averageSpeedKmh: (distanceKm / durationMinutes) * 60,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(tripsRef, newTrip);

      // Update user stats
      await this.updateUserStatsInFirestore(trip.userId, {
        totalDistanceKm: distanceKm,
        totalTrips: 1,
        totalPoints: trip.points,
        co2SavedKg: co2SavedKg,
      });

      return true;
    } catch (error) {
      console.error("❌ Error adding trip:", error);
      return false;
    }
  }

  // Alias for backward compatibility
  static async addTripHistory(userId: string, tripData: any): Promise<boolean> {
    return this.addTrip({ ...tripData, userId });
  }

  // Helper method to update user stats in Firestore
  private static async updateUserStatsInFirestore(
    userId: string,
    stats: {
      totalDistanceKm: number;
      totalTrips: number;
      totalPoints: number;
      co2SavedKg: number;
    }
  ): Promise<void> {
    try {
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentData = userDoc.data();
        await updateDoc(userRef, {
          totalDistanceKm: (currentData.totalDistanceKm || 0) + stats.totalDistanceKm,
          totalTrips: (currentData.totalTrips || 0) + stats.totalTrips,
          totalPoints: (currentData.totalPoints || 0) + stats.totalPoints,
          co2SavedKg: (currentData.co2SavedKg || 0) + stats.co2SavedKg,
          updatedAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        });
      } else {
        // Initialize new user
        await setDoc(userRef, {
          name: "New User",
          email: "",
          totalTrips: stats.totalTrips,
          totalDistanceKm: stats.totalDistanceKm,
          totalPoints: stats.totalPoints,
          co2SavedKg: stats.co2SavedKg,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("❌ Error updating user stats:", error);
    }
  }

  static async deleteTrip(tripId: string): Promise<boolean> {
    try {
      console.warn("⚠️ Delete trip not implemented yet");
      return true;
    } catch (error) {
      console.error("❌ Error deleting trip:", error);
      return false;
    }
  }

  static async clearTripHistory(): Promise<boolean> {
    try {
      console.warn("⚠️ Clear trip history not implemented yet");
      return true;
    } catch (error) {
      console.error("❌ Error clearing trip history:", error);
      return false;
    }
  }

  // Leaderboard Methods - simplified query to avoid permissions issues
  static async getLeaderboard(): Promise<LeaderboardUser[]> {
    try {
      console.log("🔥 Getting leaderboard from Firebase...");

      const usersRef = collection(firestore, "users");
      // Simplified query - remove orderBy to avoid index/permissions issues
      const querySnapshot = await getDocs(usersRef);

      const leaderboard: LeaderboardUser[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboard.push({
          id: doc.id,
          name: data.name || data.username || data.displayName || `User ${doc.id.substring(0, 6)}`,
          points: data.totalPoints || 0,
          totalDistance: `${(data.totalDistanceKm || 0).toFixed(1)} km`,
          position: 0, // Will be set after sorting
        });
      });

      // Sort manually by points (descending) and assign positions
      leaderboard.sort((a, b) => b.points - a.points);
      leaderboard.forEach((user, index) => {
        user.position = index + 1;
      });

      // Limit to top 10
      const top10 = leaderboard.slice(0, 10);

      console.log(`✅ Successfully loaded ${top10.length} users for leaderboard`);
      return top10;
    } catch (error) {
      console.error("❌ Error getting leaderboard:", error);
      // Return mock data as fallback
      return [
        {
          id: "demo-user-1",
          name: "Demo User",
          points: 500,
          totalDistance: "25.5 km",
          position: 1,
        },
        {
          id: "demo-user-2",
          name: "Test Cyclist",
          points: 350,
          totalDistance: "18.2 km",
          position: 2,
        },
      ];
    }
  }

  static async updateUserStats(userId: string, tripData: TripData): Promise<boolean> {
    try {
      const distance = parseFloat(tripData.distance.replace(" km", ""));
      const co2Saved = parseFloat(tripData.co2Saved?.replace(" kg", "") || "0");

      await this.updateUserStatsInFirestore(userId, {
        totalDistanceKm: distance,
        totalTrips: 1,
        totalPoints: tripData.points,
        co2SavedKg: co2Saved,
      });
      return true;
    } catch (error) {
      console.error("❌ Error updating user stats:", error);
      return false;
    }
  }

  // Routes Methods - using default for now
  static async getPopularRoutes(userId?: string): Promise<RouteData[]> {
    try {
      // For now, return default routes since routes collection needs setup
      return this.getDefaultRoutes();
    } catch (error) {
      console.error("❌ Error getting popular routes:", error);
      return this.getDefaultRoutes();
    }
  }

  static async addRoute(route: Omit<RouteData, "id">): Promise<boolean> {
    try {
      console.warn("⚠️ Add route not implemented yet");
      return true;
    } catch (error) {
      console.error("❌ Error adding route:", error);
      return false;
    }
  }

  // Fallback default routes
  private static getDefaultRoutes(): RouteData[] {
    return [
      {
        id: "default-1",
        name: "Dago - ITB",
        distance: "3.2 km",
        elevation: "50m",
        icon: "bicycle",
        difficulty: "easy",
      },
      {
        id: "default-2",
        name: "Asia Afrika - Alun-alun",
        distance: "1.8 km",
        elevation: "20m",
        icon: "bicycle",
        difficulty: "easy",
      },
      {
        id: "default-3",
        name: "Lembang - Cihideung",
        distance: "8.5 km",
        elevation: "200m",
        icon: "bicycle",
        difficulty: "medium",
      },
    ];
  }

  // User Management Methods
  static async updateUserProfile(userId: string, updates: any): Promise<boolean> {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("❌ Error updating user profile:", error);
      return false;
    }
  }

  static async getUserProfile(userId: string): Promise<any> {
    try {
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
      console.error("❌ Error getting user profile:", error);
      return null;
    }
  }

  // Achievement Methods
  static async getUserAchievements(userId: string): Promise<any[]> {
    try {
      console.warn("⚠️ Achievements not implemented yet");
      return [];
    } catch (error) {
      console.error("❌ Error getting user achievements:", error);
      return [];
    }
  }

  static async addUserAchievement(userId: string, achievementData: any): Promise<boolean> {
    try {
      console.warn("⚠️ Add achievement not implemented yet");
      return true;
    } catch (error) {
      console.error("❌ Error adding user achievement:", error);
      return false;
    }
  }

  // Additional methods for backward compatibility
  static async calculateUserStats(userId?: string): Promise<any> {
    try {
      if (!userId) {
        console.warn("⚠️ No userId provided for calculateUserStats");
        return {
          totalDistance: "0.0 km",
          totalTrips: 0,
          totalPoints: 0,
          co2Saved: "0.0 kg",
        };
      }

      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return {
          totalDistance: "0.0 km",
          totalTrips: 0,
          totalPoints: 0,
          co2Saved: "0.0 kg",
        };
      }

      const userData = userDoc.data();
      return {
        totalDistance: `${(userData.totalDistanceKm || 0).toFixed(1)} km`,
        totalTrips: userData.totalTrips || 0,
        totalPoints: userData.totalPoints || 0,
        co2Saved: `${(userData.co2SavedKg || 0).toFixed(1)} kg`,
      };
    } catch (error) {
      console.error("❌ Error calculating user stats:", error);
      return {
        totalDistance: "0.0 km",
        totalTrips: 0,
        totalPoints: 0,
        co2Saved: "0.0 kg",
      };
    }
  }

  static async initializeNewUser(userId: string): Promise<boolean> {
    try {
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name: "New User",
          email: "",
          totalTrips: 0,
          totalDistanceKm: 0,
          totalPoints: 0,
          co2SavedKg: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        });
      }
      return true;
    } catch (error) {
      console.error("❌ Error initializing new user:", error);
      return false;
    }
  }

  static async debugStorage(): Promise<void> {
    try {
      console.log("🔥 Using Firebase - debug through Firebase console");
      console.log("Debug info: Firebase connection active, check Firebase console for data");
    } catch (error) {
      console.error("❌ Error debugging storage:", error);
    }
  }

  // Utility Methods
  static formatDistance(distance: number): string {
    return `${distance.toFixed(1)} km`;
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  static calculateCO2Saved(distance: number): string {
    return `${(distance * 0.2).toFixed(1)} kg`;
  }

  static calculatePoints(distance: number): number {
    return Math.round(distance * 10);
  }
}

// Export default class for backwards compatibility
export default MockDataService;
