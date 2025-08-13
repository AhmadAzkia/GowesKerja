import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../config/firebase.mock";

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
      // Mock Firebase Authentication login
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log("User signed in!", user.email);

      // Reset form
      setEmail("");
      setPassword("");

      // Let _layout.tsx handle navigation automatically when auth state changes
      console.log("Waiting for auth state to propagate...");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login gagal, periksa email atau password Anda.";

      // Handle specific Firebase Auth errors
      if (error.message === "auth/user-not-found") {
        errorMessage = "Akun dengan email ini tidak ditemukan. Silakan daftar terlebih dahulu.";
      } else if (error.message === "auth/wrong-password") {
        errorMessage = "Password yang Anda masukkan salah.";
      } else if (error.message === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      } else if (error.message === "auth/user-disabled") {
        errorMessage = "Akun Anda telah dinonaktifkan.";
      } else if (error.message === "auth/too-many-requests") {
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
      Alert.alert("Email Terkirim", "Link reset password telah dikirim ke email Anda.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      Alert.alert("Error", "Gagal mengirim email reset password.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome name="bicycle" size={32} color="white" />
          </View>
          <ThemedText style={styles.title}>Masuk</ThemedText>
          <ThemedText style={styles.subtitle}>Masuk ke akun GowesKerja Anda</ThemedText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#9CA3AF" />
              <TextInput style={styles.input} placeholder="Masukkan email" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#9CA3AF" />
              <TextInput style={styles.input} placeholder="Masukkan password" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={[styles.loginButton, loading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <ThemedText style={styles.loginButtonText}>Memproses...</ThemedText>
              </View>
            ) : (
              <ThemedText style={styles.loginButtonText}>Masuk</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <ThemedText style={styles.footerText}>Belum punya akun?</ThemedText>
            <TouchableOpacity onPress={() => router.push("/register")} style={styles.registerLink}>
              <ThemedText style={styles.registerText}>Daftar di sini</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    width: "100%",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#3b82f6",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
    width: "100%",
    flexShrink: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    width: "100%",
    flexShrink: 0,
    paddingHorizontal: 16,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  forgotButton: {
    alignItems: "center",
  },
  forgotText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "#6b7280",
    fontSize: 14,
  },
  registerLink: {
    marginLeft: 4,
  },
  registerText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "500",
  },
});
