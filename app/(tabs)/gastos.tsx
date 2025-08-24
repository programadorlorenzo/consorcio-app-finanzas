import MenuCardGastos from "@/components/gastos/MenuCard";
import { stylesMenuCardGastos } from "@/styles/gastos/menu-card.styles-create-update-gasto";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

// Tipos de estado para colores
export type GastoStatusType =
  | "default"
  | "pending"
  | "completed"
  | "rejected"
  | "accent";

const TabGastos = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const menuOptions = [
    {
      id: 1,
      title: "Crear Gasto",
      description: "Registrar un nuevo Gasto",
      icon: "add-circle-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/create-update-gasto"),
      statusType: "accent" as GastoStatusType,
    },
    {
      id: 2,
      title: "Todos los Gastos",
      description: "Ver listado completo de gastos",
      icon: "list-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push("/list-gastos"),
      statusType: "default" as GastoStatusType,
    },
    {
      id: 3,
      title: "Gastos Pendientes",
      description: "Gastos en espera de confirmación",
      icon: "time-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Gastos Pendientes"),
      statusType: "pending" as GastoStatusType,
    },
    {
      id: 4,
      title: "Gastos Completados",
      description: "Gastos confirmados y finalizados",
      icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Gastos Completados"),
      statusType: "completed" as GastoStatusType,
    },
    {
      id: 5,
      title: "Gastos Rechazados",
      description: "Gastos que han sido rechazados",
      icon: "close-circle-outline" as keyof typeof Ionicons.glyphMap,
      onPress: () => console.log("Gastos Rechazados"),
      statusType: "rejected" as GastoStatusType,
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Buscar Gasto:", searchQuery);
      // Aquí podrías agregar navegación para buscar un Gasto específico
      // router.push(`/create-update-Gasto?id=${searchQuery}`);
    }
  };

  return (
    <SafeAreaView style={stylesMenuCardGastos.container}>
      <StatusBar style="auto" />

      {/* Barra de búsqueda elegante */}
      <View style={stylesMenuCardGastos.searchSection}>
        <View style={stylesMenuCardGastos.searchContainer}>
          <View style={stylesMenuCardGastos.searchIconContainer}>
            <Ionicons name="search" size={20} color={MAIN_COLOR} />
          </View>
          <TextInput
            style={stylesMenuCardGastos.searchInput}
            placeholder="Buscar por código de Gasto"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8A9A97"
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={stylesMenuCardGastos.searchButton}
          >
            <Text style={stylesMenuCardGastos.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de opciones */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={stylesMenuCardGastos.scrollContent}
      >
        <View style={stylesMenuCardGastos.menuGrid}>
          {menuOptions.map((option) => (
            <MenuCardGastos
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onPress={option.onPress}
              statusType={option.statusType}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TabGastos;
