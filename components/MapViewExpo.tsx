import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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

export default function MapViewComponent({
  latitude = -6.9175, // Default to Bandung
  longitude = 107.6191,
  markers = [],
  showUserLocation = true,
  style,
}: MapViewComponentProps) {
  // If we have valid coordinates, use real maps
  if (latitude && longitude) {
    const initialRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    try {
      return (
        <View style={[styles.container, style]}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={showUserLocation}
            showsMyLocationButton={false}
            mapType="standard"
            zoomEnabled={true}
            scrollEnabled={true}
            pitchEnabled={false}
            rotateEnabled={false}
            provider={PROVIDER_GOOGLE}
            loadingEnabled={true}
            loadingIndicatorColor="#007AFF"
            loadingBackgroundColor="#ffffff"
            onMapReady={() => console.log("Map is ready!")}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
                description={marker.description}
              />
            ))}
          </MapView>
        </View>
      );
    } catch (error) {
      console.log("MapView error, falling back to placeholder:", error);
    }
  }

  // Fallback for development or when maps are not available
  return (
    <View style={[styles.fallbackContainer, style]}>
      <View style={styles.fallbackContent}>
        <FontAwesome name="map" size={48} color="#007AFF" />
        <Text style={styles.fallbackTitle}>{latitude && longitude ? "Maps Loading..." : "Waiting for Location..."}</Text>
        <Text style={styles.fallbackSubtitle}>{latitude && longitude ? "Google Maps will appear here" : "Enable location to see maps"}</Text>

        {latitude && longitude && (
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesTitle}>Current Location:</Text>
            <Text style={styles.coordinates}>Lat: {latitude.toFixed(4)}</Text>
            <Text style={styles.coordinates}>Lng: {longitude.toFixed(4)}</Text>
          </View>
        )}

        {showUserLocation && latitude && longitude && (
          <View style={styles.userLocationIndicator}>
            <FontAwesome name="location-arrow" size={16} color="#4CAF50" />
            <Text style={styles.userLocationText}>Location Found</Text>
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  fallbackContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 12,
    textAlign: "center",
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  coordinatesContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 8,
    minWidth: 200,
  },
  coordinatesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
    textAlign: "center",
  },
  coordinates: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontFamily: "monospace",
  },
  userLocationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 8,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 6,
  },
  userLocationText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 6,
    fontWeight: "500",
  },
  markersContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: 8,
    maxWidth: 250,
  },
  markersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F44336",
    marginBottom: 8,
    textAlign: "center",
  },
  markerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  markerText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 6,
    flex: 1,
  },
  moreMarkers: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
});
