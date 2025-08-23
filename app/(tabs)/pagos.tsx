import MenuCardPagos from "@/components/pagos/MenuCard";
import { menuCardStyles } from "@/styles/pagos/menu-card.styles";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MAIN_COLOR } from "../constants";

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
    <SafeAreaView style={menuCardStyles.container}>
      <StatusBar style="auto" />

      {/* Barra de búsqueda elegante */}
      <View style={menuCardStyles.searchSection}>
        <View style={menuCardStyles.searchContainer}>
          <View style={menuCardStyles.searchIconContainer}>
            <Ionicons name="search" size={20} color={MAIN_COLOR} />
          </View>
          <TextInput
            style={menuCardStyles.searchInput}
            placeholder="Buscar por código de pago"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8A9A97"
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={menuCardStyles.searchButton}
          >
            <Text style={menuCardStyles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de opciones */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={menuCardStyles.scrollContent}
      >
        <View style={menuCardStyles.menuGrid}>
          {menuOptions.map((option) => (
            <MenuCardPagos
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

export default TabPagos;
