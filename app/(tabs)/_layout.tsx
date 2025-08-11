import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { auth } from "../../config/firebase";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // unsubscribe on unmount
  }, []);

  // Jika masih loading, tampilkan loading state
  if (loading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {/* Login Tab - always available but hidden when logged in */}
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="sign-in" color={color} />,
          tabBarStyle: { display: "none" }, // Always hide tab bar for login
          href: !user ? "/login" : null, // Show only when not logged in
        }}
      />

      {/* Register Tab - always available but hidden when logged in */}
      <Tabs.Screen
        name="register"
        options={{
          title: "Register",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user-plus" color={color} />,
          tabBarStyle: { display: "none" }, // Always hide tab bar for register
          href: !user ? "/register" : null, // Show only when not logged in
        }}
      />

      {/* Main App Tabs - only show when logged in */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
          href: user ? "/" : null, // Show only when logged in
        }}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="trophy" color={color} />,
          href: user ? "/leaderboard" : null, // Show only when logged in
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="history" color={color} />,
          href: user ? "/history" : null, // Show only when logged in
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
          href: user ? "/profile" : null, // Show only when logged in
        }}
      />
    </Tabs>
  );
}
