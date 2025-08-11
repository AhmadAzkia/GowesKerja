import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../config/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Mohon isi email dan password.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Format email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      // Firebase Authentication login
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log("User signed in!", user.email);
      Alert.alert("Sukses", "Login berhasil!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setEmail("");
            setPassword("");
            // Navigate to main app (index tab)
            router.replace("/(tabs)");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login gagal, periksa email atau password Anda.";

      // Handle specific Firebase Auth errors
      if (error.code === "auth/user-not-found") {
        errorMessage = "Akun dengan email ini tidak ditemukan.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Password yang Anda masukkan salah.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Akun Anda telah dinonaktifkan.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Mohon masukkan email Anda terlebih dahulu.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Format email tidak valid.");
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert("Email Terkirim", "Link reset password telah dikirim ke email Anda. Silakan periksa inbox dan folder spam.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      let errorMessage = "Gagal mengirim email reset password.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Akun dengan email ini tidak ditemukan.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-20 pb-8">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-blue-500 rounded-full justify-center items-center mb-4">
            <FontAwesome name="sign-in" size={32} color="white" />
          </View>
          <ThemedText className="text-3xl font-bold text-gray-800 mb-2">Masuk</ThemedText>
          <ThemedText className="text-base text-gray-600 text-center">Masuk ke akun GowesKerja Anda</ThemedText>
        </View>

        {/* Login Form */}
        <View className="space-y-4 mb-8">
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
                placeholder="Masukkan password Anda"
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
        </View>

        {/* Login Button */}
        <TouchableOpacity className={`bg-blue-500 py-4 px-8 rounded-xl items-center mb-6 ${loading ? "opacity-70" : ""}`} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
              <ThemedText className="text-white text-lg font-semibold">Memproses...</ThemedText>
            </View>
          ) : (
            <ThemedText className="text-white text-lg font-semibold">Login</ThemedText>
          )}
        </TouchableOpacity>

        {/* Additional Actions */}
        <View className="items-center space-y-4">
          <TouchableOpacity onPress={handleForgotPassword}>
            <ThemedText className="text-blue-500 text-sm font-medium">Lupa Password?</ThemedText>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <ThemedText className="text-gray-600 text-sm">Belum punya akun?</ThemedText>
            <TouchableOpacity className="ml-1" onPress={() => router.push("/(tabs)/register")}>
              <ThemedText className="text-blue-500 text-sm font-medium">Daftar di sini</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View className="mt-8 pt-6 border-t border-gray-200">
          <ThemedText className="text-center text-xs text-gray-500 mb-4">Bergabung dengan ribuan pengguna GowesKerja</ThemedText>
          <View className="flex-row justify-around">
            <View className="items-center">
              <ThemedText className="text-lg font-bold text-blue-500">10K+</ThemedText>
              <ThemedText className="text-xs text-gray-500">Pengguna Aktif</ThemedText>
            </View>
            <View className="items-center">
              <ThemedText className="text-lg font-bold text-green-500">50K+</ThemedText>
              <ThemedText className="text-xs text-gray-500">Perjalanan</ThemedText>
            </View>
            <View className="items-center">
              <ThemedText className="text-lg font-bold text-yellow-500">1M+</ThemedText>
              <ThemedText className="text-xs text-gray-500">KM Ditempuh</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
