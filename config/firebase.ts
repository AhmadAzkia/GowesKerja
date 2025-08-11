// React Native Firebase Configuration
// Konfigurasi Firebase sudah otomatis dari google-services.json
// Hanya perlu export services yang dibutuhkan

import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

// Test inisialisasi
try {
  console.log("Firebase services initialized");
  console.log("Auth app:", auth().app.name);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Export Firebase services
export { auth, database };

console.log("React Native Firebase services exported successfully");
