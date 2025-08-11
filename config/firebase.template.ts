// Firebase Web SDK Configuration Template (compatible with Expo)
import { getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

// IMPORTANT: Replace these values with your actual Firebase configuration
// Get these values from your Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase with error handling
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log("Firebase app initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw new Error("Firebase configuration failed");
}

// Initialize Firebase Authentication with proper error handling and typing
let auth: Auth;
try {
  // For Expo/React Native, use browserLocalPersistence for persistent login
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence
  });
  console.log("Firebase Auth initialized with local persistence");
} catch {
  console.log("Auth already initialized, getting existing instance");
  // If already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Realtime Database and get a reference to the service
const database: Database = getDatabase(app);

// Validate Firebase configuration
if (!auth) {
  throw new Error("Firebase Auth not properly initialized");
}

if (!database) {
  throw new Error("Firebase Database not properly initialized");
}

console.log("Firebase configuration complete - Auth and Database ready");

// Export Firebase services
export { auth, database };
export default app;
