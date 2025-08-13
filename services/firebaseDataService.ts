import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { firestore } from "../config/firebase";

// Updated interfaces to match Firestore structure
export interface TripData {
  id: string;
  userId: string;
  tripDate: Date;
  distanceKm: number;
  durationMinutes: number;
  points: number;
  routeId: string;
  routeName: string;
  co2SavedKg: number;
  createdAt?: Date;
  updatedAt?: Date;

  // Computed getters untuk display
  get dateString(): string;
  get timeString(): string;
  get distanceString(): string;
  get durationString(): string;
}

export interface UserData {
  name: string;
  email: string;
  totalTrips: number;
  totalDistanceKm: number;
  totalPoints: number;
  co2SavedKg: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastActiveAt?: Date;
}

export interface LeaderboardUser {
  id: string;
  userId: string;
  name: string;
  totalPoints: number;
  totalTrips: number;
  totalDistanceKm: number;
  co2SavedKg: number;
  currentPosition: number;
  previousPosition: number;
  updatedAt?: Date;
}

export interface RouteData {
  id: string;
  name: string;
  description?: string;
  distanceKm: number;
  elevationM: number;
  estimatedDurationMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  icon: string;
  category: string;
  startPoint: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    name: string;
  };
  endPoint: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    name: string;
  };
  waypoints?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    name: string;
  }[];
  totalUsage: number;
  averageRating: number;
  isActive: boolean;
  isPopular: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement: {
    type: string;
    value: number;
  };
  isActive: boolean;
  createdAt?: Date;
}

export class FirebaseDataService {
  // Collection references
  private static USERS_COLLECTION = "users";
  private static TRIPS_COLLECTION = "trips";
  private static ROUTES_COLLECTION = "routes";
  private static LEADERBOARD_COLLECTION = "leaderboard";
  private static ACHIEVEMENTS_COLLECTION = "achievements";

  // Helper function to convert Firestore timestamp to Date
  private static timestampToDate(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date();
  }

  // Helper function to create TripData with getters
  private static createTripData(data: any): TripData {
    const tripData = {
      ...data,
      tripDate: this.timestampToDate(data.tripDate),
      createdAt: this.timestampToDate(data.createdAt),
      updatedAt: this.timestampToDate(data.updatedAt),

      get dateString(): string {
        return this.tripDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },

      get timeString(): string {
        return this.tripDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
      },

      get distanceString(): string {
        return `${this.distanceKm.toFixed(1)} km`;
      },

      get durationString(): string {
        return `${this.durationMinutes} menit`;
      },
    };

    return tripData as TripData;
  }

  // User Management
  static async initializeNewUser(userId: string, userData: Partial<UserData>): Promise<boolean> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);

      const newUser: UserData = {
        name: userData.name || "User",
        email: userData.email || "",
        totalTrips: 0,
        totalDistanceKm: 0,
        totalPoints: 0,
        co2SavedKg: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      };

      await setDoc(userRef, {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });

      console.log(`✅ User ${userId} initialized in Firebase`);
      return true;
    } catch (error) {
      console.error("❌ Error initializing user:", error);
      return false;
    }
  }

  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          createdAt: this.timestampToDate(data.createdAt),
          updatedAt: this.timestampToDate(data.updatedAt),
          lastActiveAt: this.timestampToDate(data.lastActiveAt),
        } as UserData;
      }

      return null;
    } catch (error) {
      console.error("❌ Error getting user data:", error);
      return null;
    }
  }

  static async updateUserStats(userId: string, stats: Partial<UserData>): Promise<boolean> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);

      await updateDoc(userRef, {
        ...stats,
        updatedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });

      console.log(`✅ User ${userId} stats updated`);
      return true;
    } catch (error) {
      console.error("❌ Error updating user stats:", error);
      return false;
    }
  }

  // Trip Management
  static async getUserTrips(userId: string): Promise<TripData[]> {
    try {
      const tripsRef = collection(firestore, this.TRIPS_COLLECTION);
      const q = query(tripsRef, where("userId", "==", userId), orderBy("tripDate", "desc"));

      const querySnapshot = await getDocs(q);
      const trips: TripData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trips.push(this.createTripData({ id: doc.id, ...data }));
      });

      console.log(`📊 Found ${trips.length} trips for user ${userId}`);
      return trips;
    } catch (error) {
      console.error("❌ Error getting user trips:", error);
      return [];
    }
  }

  static async addTrip(
    userId: string,
    tripData: {
      routeId: string;
      routeName: string;
      distanceKm: number;
      durationMinutes: number;
      points: number;
    }
  ): Promise<boolean> {
    try {
      const tripsRef = collection(firestore, this.TRIPS_COLLECTION);

      const co2SavedKg = tripData.distanceKm * 0.25; // 0.25kg CO2 per km

      const newTrip = {
        userId,
        tripDate: serverTimestamp(),
        distanceKm: tripData.distanceKm,
        durationMinutes: tripData.durationMinutes,
        points: tripData.points,
        routeId: tripData.routeId,
        routeName: tripData.routeName,
        co2SavedKg,
        averageSpeedKmh: (tripData.distanceKm / tripData.durationMinutes) * 60,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(tripsRef, newTrip);

      // Update user stats
      await this.recalculateUserStats(userId);

      // Update route usage
      await this.updateRouteUsage(tripData.routeId);

      // Update leaderboard
      await this.updateLeaderboard(userId);

      console.log(`✅ Trip added with ID: ${docRef.id}`);
      return true;
    } catch (error) {
      console.error("❌ Error adding trip:", error);
      return false;
    }
  }

  // Route Management
  static async getAvailableRoutes(): Promise<RouteData[]> {
    try {
      const routesRef = collection(firestore, this.ROUTES_COLLECTION);
      const q = query(routesRef, where("isActive", "==", true));

      const querySnapshot = await getDocs(q);
      const routes: RouteData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        routes.push({
          id: doc.id,
          ...data,
          createdAt: this.timestampToDate(data.createdAt),
          updatedAt: this.timestampToDate(data.updatedAt),
        } as RouteData);
      });

      console.log(`🛣️ Found ${routes.length} available routes`);
      return routes;
    } catch (error) {
      console.error("❌ Error getting routes:", error);
      return [];
    }
  }

  static async getPopularRoutes(userId: string, limit_count: number = 4): Promise<RouteData[]> {
    try {
      // Get user's most used routes
      const trips = await this.getUserTrips(userId);

      if (trips.length === 0) {
        return [];
      }

      // Count route usage
      const routeUsage: { [key: string]: number } = {};
      trips.forEach((trip) => {
        if (routeUsage[trip.routeId]) {
          routeUsage[trip.routeId]++;
        } else {
          routeUsage[trip.routeId] = 1;
        }
      });

      // Get most used route IDs
      const popularRouteIds = Object.entries(routeUsage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit_count)
        .map(([routeId]) => routeId);

      // Get route details
      const routes = await this.getAvailableRoutes();
      const popularRoutes = routes.filter((route) => popularRouteIds.includes(route.id));

      console.log(`🏆 Found ${popularRoutes.length} popular routes for user ${userId}`);
      return popularRoutes;
    } catch (error) {
      console.error("❌ Error getting popular routes:", error);
      return [];
    }
  }

  // Leaderboard Management
  static async getLeaderboard(limit_count: number = 10): Promise<LeaderboardUser[]> {
    try {
      const leaderboardRef = collection(firestore, this.LEADERBOARD_COLLECTION);
      const q = query(leaderboardRef, orderBy("totalPoints", "desc"), limit(limit_count));

      const querySnapshot = await getDocs(q);
      const leaderboard: LeaderboardUser[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboard.push({
          id: doc.id,
          ...data,
          currentPosition: leaderboard.length + 1,
          updatedAt: this.timestampToDate(data.updatedAt),
        } as LeaderboardUser);
      });

      console.log(`🏆 Leaderboard loaded with ${leaderboard.length} entries`);
      return leaderboard;
    } catch (error) {
      console.error("❌ Error getting leaderboard:", error);
      return [];
    }
  }

  // Helper Methods
  private static async recalculateUserStats(userId: string): Promise<void> {
    try {
      const trips = await this.getUserTrips(userId);

      const stats = {
        totalTrips: trips.length,
        totalDistanceKm: trips.reduce((sum, trip) => sum + trip.distanceKm, 0),
        totalPoints: trips.reduce((sum, trip) => sum + trip.points, 0),
        co2SavedKg: trips.reduce((sum, trip) => sum + trip.co2SavedKg, 0),
      };

      await this.updateUserStats(userId, stats);
    } catch (error) {
      console.error("❌ Error recalculating user stats:", error);
    }
  }

  private static async updateRouteUsage(routeId: string): Promise<void> {
    try {
      const routeRef = doc(firestore, this.ROUTES_COLLECTION, routeId);
      const routeSnap = await getDoc(routeRef);

      if (routeSnap.exists()) {
        const currentUsage = routeSnap.data().totalUsage || 0;
        await updateDoc(routeRef, {
          totalUsage: currentUsage + 1,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("❌ Error updating route usage:", error);
    }
  }

  private static async updateLeaderboard(userId: string): Promise<void> {
    try {
      const userData = await this.getUserData(userId);
      if (!userData) return;

      const leaderboardRef = doc(firestore, this.LEADERBOARD_COLLECTION, userId);

      await setDoc(
        leaderboardRef,
        {
          userId,
          name: userData.name,
          totalPoints: userData.totalPoints,
          totalTrips: userData.totalTrips,
          totalDistanceKm: userData.totalDistanceKm,
          co2SavedKg: userData.co2SavedKg,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("❌ Error updating leaderboard:", error);
    }
  }

  // Debug method
  static async debugFirestore(): Promise<void> {
    console.log("=== FIREBASE FIRESTORE DEBUG ===");
    try {
      const collections = [this.USERS_COLLECTION, this.TRIPS_COLLECTION, this.ROUTES_COLLECTION, this.LEADERBOARD_COLLECTION];

      for (const collectionName of collections) {
        const collectionRef = collection(firestore, collectionName);
        const snapshot = await getDocs(collectionRef);
        console.log(`${collectionName}: ${snapshot.size} documents`);
      }

      console.log("=== END FIRESTORE DEBUG ===");
    } catch (error) {
      console.error("❌ Error debugging Firestore:", error);
    }
  }

  // Clear user data (for testing)
  static async clearUserData(userId: string): Promise<boolean> {
    try {
      // Delete user trips
      const tripsRef = collection(firestore, this.TRIPS_COLLECTION);
      const q = query(tripsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const deletePromises: Promise<void>[] = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });

      await Promise.all(deletePromises);

      // Reset user stats
      await this.updateUserStats(userId, {
        totalTrips: 0,
        totalDistanceKm: 0,
        totalPoints: 0,
        co2SavedKg: 0,
      });

      // Remove from leaderboard
      const leaderboardRef = doc(firestore, this.LEADERBOARD_COLLECTION, userId);
      await deleteDoc(leaderboardRef);

      console.log(`🗑️ User ${userId} data cleared`);
      return true;
    } catch (error) {
      console.error("❌ Error clearing user data:", error);
      return false;
    }
  }
}
