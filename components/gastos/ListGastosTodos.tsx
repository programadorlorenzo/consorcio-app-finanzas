import { listarGastos } from "@/api/gastos/gastos-api";
import { MAIN_COLOR } from "@/app/constants";
import { Gasto } from "@/types/gastos/gastos.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { stylesListGastos } from "../../styles/gastos/list-gastos.styles";
import GastoCard from "./GastoCard";

export default function ListGastosTodos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGastos = async () => {
    try {
      const data = (await listarGastos()) as any; // Tipo temporal
      setGastos(data);
    } catch (error) {
      console.error("Error cargando gastos:", error);
      Alert.alert("Error", "No se pudieron cargar los gastos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGastos();
  };

  useEffect(() => {
    loadGastos();
  }, []);

  if (loading) {
    return (
      <View style={stylesListGastos.loadingContainer}>
        <ActivityIndicator size="large" color={MAIN_COLOR} />
        <Text style={stylesListGastos.loadingText}>Cargando gastos...</Text>
      </View>
    );
  }

  return (
    <View style={stylesListGastos.container}>
      <ScrollView
        style={stylesListGastos.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {gastos.length === 0 ? (
          <View style={stylesListGastos.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#8A9A97" />
            <Text style={stylesListGastos.emptyText}>
              No hay gastos registrados
            </Text>
          </View>
        ) : (
          <View style={stylesListGastos.listContainer}>
            {gastos.map((gasto) => (
              <GastoCard
                key={gasto.id}
                gasto={gasto}
                onPress={() => {
                  // TODO: Navegar a detalle del gasto
                  console.log("Ver detalle gasto:", gasto.id);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
