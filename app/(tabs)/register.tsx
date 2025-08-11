import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View } from "react-native";
import { auth, database } from "../../config/firebase";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert("Error", "Mohon isi semua field.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      // Firebase Authentication registration
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await user.updateProfile({
        displayName: name,
      });

      // Store user data in Firebase Realtime Database
      const userData = {
        name: name,
        email: email,
        joinDate: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        totalTrips: 0,
        totalDistance: "0 km",
        co2Saved: "0 kg",
        points: 0,
        uid: user.uid,
      };

      // Save to Firebase Realtime Database
      await database().ref(`users/${user.uid}`).set(userData);

      console.log("User registered successfully!", user.email);
      Alert.alert("Sukses", "Pendaftaran berhasil! Silakan login dengan akun Anda.", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setName("");
            // Navigate to login screen
            router.push("/(tabs)/login");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Pendaftaran gagal. Silakan coba lagi.";

      // Handle specific Firebase Auth errors
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email ini sudah digunakan oleh akun lain.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Pendaftaran dengan email/password tidak diizinkan.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-20 pb-8">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-green-500 rounded-full justify-center items-center mb-4">
            <FontAwesome name="user-plus" size={32} color="white" />
          </View>
          <ThemedText className="text-3xl font-bold text-gray-800 mb-2">Daftar</ThemedText>
          <ThemedText className="text-base text-gray-600 text-center">Buat akun GowesKerja baru</ThemedText>
        </View>

        {/* Registration Form */}
        <View className="space-y-4 mb-8">
          {/* Name Input */}
          <View>
            <ThemedText className="text-sm font-medium text-gray-700 mb-2">Nama Lengkap</ThemedText>
            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
              <FontAwesome name="user" size={16} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput className="flex-1 text-base text-gray-800" placeholder="Masukkan nama lengkap" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} autoCapitalize="words" autoCorrect={false} />
            </View>
          </View>

          {/* Email Input */}
          <View>
            <ThemedText className="text-sm font-medium text-gray-700 mb-2">Email</ThemedText>
            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
              <FontAwesome name="envelope" size={16} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Masukkan email Anda"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <ThemedText className="text-sm font-medium text-gray-700 mb-2">Password</ThemedText>
            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
              <FontAwesome name="lock" size={16} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Masukkan password (min. 6 karakter)"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View>
            <ThemedText className="text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</ThemedText>
            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
              <FontAwesome name="lock" size={16} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Ulangi password Anda"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="ml-2">
                <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity className={`bg-green-500 py-4 px-8 rounded-xl items-center mb-6 ${loading ? "opacity-70" : ""}`} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
              <ThemedText className="text-white text-lg font-semibold">Memproses...</ThemedText>
            </View>
          ) : (
            <ThemedText className="text-white text-lg font-semibold">Daftar</ThemedText>
          )}
        </TouchableOpacity>

        {/* Additional Actions */}
        <View className="items-center">
          <View className="flex-row items-center">
            <ThemedText className="text-gray-600 text-sm">Sudah punya akun?</ThemedText>
            <TouchableOpacity className="ml-1" onPress={() => router.push("/(tabs)/login")}>
              <ThemedText className="text-green-500 text-sm font-medium">Masuk di sini</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
