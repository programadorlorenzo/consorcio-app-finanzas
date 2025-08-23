import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const menuCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },

  // Header con patrón elegante
  header: {
    paddingTop: 20,
    paddingBottom: 45,
    position: "relative",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8E6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: "transparent",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  logo: {
    width: 55,
    height: 55,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: MAIN_COLOR,
    letterSpacing: 0.5,
  },

  // Sección de búsqueda
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E8E6",
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  searchIconContainer: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: MAIN_COLOR,
    fontWeight: "500",
  },
  searchButton: {
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Contenido principal
  scrollContent: {
    paddingBottom: 30,
  },
  menuGrid: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Cards elegantes
  card: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  accentCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: MAIN_COLOR,
  },
  cardPattern: {
    position: "relative",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    minHeight: 80,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  accentIconContainer: {
    backgroundColor: `${MAIN_COLOR}15`,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  accentCardTitle: {
    color: MAIN_COLOR,
  },
  cardDescription: {
    fontSize: 14,
    color: "#B8E6D3",
    fontWeight: "400",
    lineHeight: 20,
  },
  accentCardDescription: {
    color: "#6B8A86",
  },
  chevronContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Footer elegante
  footer: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerPattern: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E8E6",
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  footerText: {
    fontSize: 14,
    color: MAIN_COLOR,
    fontWeight: "600",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#8A9A97",
    fontWeight: "400",
  },
});
