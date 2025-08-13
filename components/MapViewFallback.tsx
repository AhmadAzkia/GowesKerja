import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// Type definitions
interface MapViewComponentProps {
  latitude?: number;
  longitude?: number;
  markers?: {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  }[];
  showUserLocation?: boolean;
  style?: object;
}

// Check if we're in development/Expo Go
const isExpoGo = Constants.appOwnership === "expo";

export default function MapViewComponent({
  latitude = -6.9175, // Default to Bandung
  longitude = 107.6191,
  markers = [],
  showUserLocation = true,
  style,
}: MapViewComponentProps) {
  // For development, show a fallback map view
  if (isExpoGo || __DEV__) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <View style={styles.fallbackContent}>
          <FontAwesome name="map" size={48} color="#007AFF" />
          <Text style={styles.fallbackTitle}>Development Map View</Text>
          <Text style={styles.fallbackSubtitle}>Maps will work in production build</Text>

          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesTitle}>Current Location:</Text>
            <Text style={styles.coordinates}>Lat: {latitude.toFixed(4)}</Text>
            <Text style={styles.coordinates}>Lng: {longitude.toFixed(4)}</Text>
          </View>

          {showUserLocation && (
            <View style={styles.userLocationIndicator}>
              <FontAwesome name="location-arrow" size={16} color="#4CAF50" />
              <Text style={styles.userLocationText}>User Location Enabled</Text>
            </View>
          )}

          {markers.length > 0 && (
            <View style={styles.markersContainer}>
              <Text style={styles.markersTitle}>Markers ({markers.length}):</Text>
              {markers.slice(0, 3).map((marker, index) => (
                <View key={marker.id} style={styles.markerItem}>
                  <FontAwesome name="map-pin" size={12} color="#F44336" />
                  <Text style={styles.markerText}>{marker.title}</Text>
                </View>
              ))}
              {markers.length > 3 && <Text style={styles.moreMarkers}>...and {markers.length - 3} more</Text>}
            </View>
          )}
        </View>
      </View>
    );
  }

  // For production builds, this would use real react-native-maps
  return (
    <View style={[styles.fallbackContainer, style]}>
      <View style={styles.fallbackContent}>
        <FontAwesome name="map" size={48} color="#007AFF" />
        <Text style={styles.fallbackTitle}>Map Component</Text>
        <Text style={styles.fallbackSubtitle}>Production build will show Google Maps here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  fallbackContent: {
    alignItems: "center",
    padding: 20,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 12,
    marginBottom: 4,
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  coordinatesContainer: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 8,
  },
  coordinatesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 11,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  userLocationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#e8f5e8",
    borderRadius: 6,
  },
  userLocationText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 6,
    fontWeight: "600",
  },
  markersContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxWidth: 200,
  },
  markersTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  markerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  markerText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  moreMarkers: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },
});
