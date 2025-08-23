import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MAIN_COLOR } from "../constants";

// Colores corporativos

const MenuCard = ({
  title,
  description,
  icon,
  onPress,
  isAccent = false,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isAccent?: boolean;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, isAccent && styles.accentCard]}
    >
      <View style={styles.cardPattern}>
        <View style={styles.cardContent}>
          <View
            style={[
              styles.iconContainer,
              isAccent && styles.accentIconContainer,
            ]}
          >
            <Ionicons
              name={icon}
              size={28}
              color={isAccent ? MAIN_COLOR : "#fff"}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[styles.cardTitle, isAccent && styles.accentCardTitle]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.cardDescription,
                isAccent && styles.accentCardDescription,
              ]}
            >
              {description}
            </Text>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isAccent ? MAIN_COLOR : "#fff"}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TabPagos = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const menuOptions = [
    {
      id: 1,
      title: "Crear Pago",
      description: "Registrar un nuevo pago en el sistema",
      icon: "add-circle-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Crear Pago"),
      isAccent: true,
    },
    {
      id: 2,
      title: "Todos los Pagos",
      description: "Ver listado completo de pagos",
      icon: "list-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Todos los Pagos"),
    },
    {
      id: 3,
      title: "Pagos Pendientes",
      description: "Pagos en espera de confirmación",
      icon: "time-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Pagos Pendientes"),
    },
    {
      id: 4,
      title: "Pagos Completados",
      description: "Pagos confirmados y finalizados",
      icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Pagos Completados"),
    },
    {
      id: 5,
      title: "Pagos Rechazados",
      description: "Pagos que han sido rechazados",
      icon: "close-circle-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Pagos Rechazados"),
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Buscar pago:", searchQuery);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Barra de búsqueda elegante */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color={MAIN_COLOR} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por código de pago"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8A9A97"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de opciones */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.menuGrid}>
          {menuOptions.map((option) => (
            <MenuCard
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onPress={option.onPress}
              isAccent={option.isAccent}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default TabPagos;
