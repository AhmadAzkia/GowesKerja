import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
// import "../global.css";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      console.log("_layout auth state changed:", currentUser ? `User: ${currentUser.email}` : "No user");
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === "(tabs)";
    const currentSegment = segments[0] as string;
    const inJourneyGroup = currentSegment === "start-journey" || currentSegment === "journey-tracking";
    const onAuthPages = currentSegment === "login" || currentSegment === "register";
    console.log("Routing check:", {
      user: user ? user.email : "none",
      segments,
      inTabsGroup,
      inJourneyGroup,
      onAuthPages,
      loading,
    });

    if (!user && (inTabsGroup || inJourneyGroup)) {
      // User is not logged in but trying to access protected routes
      console.log("Redirecting to login - user not authenticated");
      router.replace("/login");
    } else if (user && onAuthPages) {
      // User is logged in but still on login/register pages
      console.log("Redirecting to tabs - user authenticated but on auth pages");
      router.replace("/(tabs)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, segments, loading]);

  if (!loaded || loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="start-journey" options={{ headerShown: false }} />
        <Stack.Screen name="journey-tracking" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
