import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const stylesMenuCardRendiciones = StyleSheet.create({
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

  // Card principal con diseño mejorado
  card: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 8,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  // Card accent con fondo blanco
  accentCard: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    borderWidth: 2,
    borderColor: MAIN_COLOR,
  },

  cardPattern: {
    position: "relative",
    overflow: "hidden",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    zIndex: 2,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  accentCardTitle: {
    color: MAIN_COLOR,
  },

  cardDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 20,
    fontWeight: "500",
  },

  accentCardDescription: {
    color: "#666",
  },

  chevronContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Sección de búsqueda rápida
  searchSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#F0F4F2",
  },

  searchTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  searchInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E8F1EE",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#FAFCFB",
    color: "#333",
    fontWeight: "500",
  },

  searchInputFocused: {
    borderColor: MAIN_COLOR,
    backgroundColor: "#fff",
  },

  searchButton: {
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 12,
    elevation: 4,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  searchButtonDisabled: {
    backgroundColor: "#B8C9C1",
    elevation: 0,
    shadowOpacity: 0,
  },

  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Hint para formato de búsqueda
  searchHint: {
    fontSize: 13,
    color: "#7A8F85",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 8,
    lineHeight: 18,
  },

  // Sección del menú
  menuSection: {
    paddingTop: 10,
    paddingBottom: 30,
  },

  // Card deshabilitado
  disabledCard: {
    opacity: 0.5,
    backgroundColor: "#B8C9C1",
  },
});
