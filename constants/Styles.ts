import { StyleSheet } from "react-native";

export const colors = {
  primary: "#10b981",
  primaryLight: "#34d399",
  primaryDark: "#047857",
  secondary: "#3b82f6",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  white: "#ffffff",
  black: "#000000",
  red500: "#ef4444",
  blue500: "#3b82f6",
  blue50: "#eff6ff",
  green500: "#10b981",
  green50: "#ecfdf5",
};

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },

  // Card styles
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Button styles
  primaryButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },

  // Input styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },

  // Text styles
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },

  // Header styles
  header: {
    alignItems: "center",
    marginBottom: 32,
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

  // Stats styles
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },

  // Loading styles
  loading: {
    marginTop: 16,
    color: "#6b7280",
  },

  // Form styles
  formContainer: {
    marginBottom: 32,
  },

  // Link styles
  link: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "500",
  },
  linkContainer: {
    marginLeft: 4,
  },

  // Profile styles
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileIcon: {
    width: 96,
    height: 96,
    backgroundColor: "#3b82f6",
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileEmail: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  profileJoinDate: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
});
