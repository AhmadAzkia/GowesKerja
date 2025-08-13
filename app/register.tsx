import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { auth, database } from "../config/firebase.mock";

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
      Alert.alert("Error", "Mohon isi semua field yang diperlukan.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password harus minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      // Mock Firebase Authentication registration
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update user profile with name
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
            router.push("/login");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Pendaftaran gagal. Silakan coba lagi.";

      // Handle specific Firebase Auth errors
      if (error.message === "auth/email-already-in-use") {
        errorMessage = "Email ini sudah digunakan oleh akun lain.";
      } else if (error.message === "auth/invalid-email") {
        errorMessage = "Format email tidak valid.";
      } else if (error.message === "auth/weak-password") {
        errorMessage = "Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.";
      } else if (error.message === "auth/operation-not-allowed") {
        errorMessage = "Pendaftaran dengan email/password tidak diizinkan.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome name="user-plus" size={32} color="white" />
          </View>
          <ThemedText style={styles.title}>Daftar</ThemedText>
          <ThemedText style={styles.subtitle}>Buat akun GowesKerja baru</ThemedText>
        </View>

        {/* Registration Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nama Lengkap</ThemedText>
            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#9CA3AF" />
              <TextInput style={styles.input} placeholder="Masukkan nama lengkap" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} autoCapitalize="words" autoCorrect={false} />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={20} color="#9CA3AF" />
              <TextInput style={styles.input} placeholder="Masukkan email Anda" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Masukkan password (min. 6 karakter)"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Konfirmasi Password</ThemedText>
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Ulangi password Anda"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity style={[styles.registerButton, loading && styles.registerButtonDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <ThemedText style={styles.registerButtonText}>Memproses...</ThemedText>
              </View>
            ) : (
              <ThemedText style={styles.registerButtonText}>Daftar</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <ThemedText style={styles.footerText}>Sudah punya akun?</ThemedText>
            <TouchableOpacity onPress={() => router.push("/login")} style={styles.loginLink}>
              <ThemedText style={styles.loginText}>Masuk di sini</ThemedText>
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
    backgroundColor: "#10b981",
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
  registerButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  loginLink: {
    marginLeft: 4,
  },
  loginText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "500",
  },
});
