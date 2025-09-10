import { obtenerRendicionActiva } from "@/api/rendiciones/rendiciones-api";
import { MAIN_COLOR } from "@/app/constants";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/components/providers/AuthProvider";
import MenuCardRendiciones from "@/components/rendiciones/MenuCard";
import { stylesMenuCardRendiciones } from "@/styles/rendiciones/menu-card.styles";
import {
  Rendicion,
  RendicionStatusType,
  getRendicionEstado,
} from "@/types/rendiciones/rendiciones.types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RendicionScreen() {
  const { user } = useAuth();
  const [rendicionActiva, setRendicionActiva] = useState<Rendicion | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showBankingDetails, setShowBankingDetails] = useState(false);

  // Helper para detectar si es administrador
  const esAdministrador = useCallback((): boolean => {
    const rolNombre = user?.rol?.nombre?.toLowerCase() || "";
    
    return (
      rolNombre.includes("admin") ||
      rolNombre.includes("administrador") ||
      rolNombre === "admin" ||
      false
    );
  }, [user]);

  // Helper function para convertir valores a número y formatear
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
  };

  const checkRendicionActiva = useCallback(async () => {
    try {
      setLoading(true);
      const rendicion = await obtenerRendicionActiva();
      setRendicionActiva(rendicion);
    } catch (error) {
      console.error("Error al verificar rendición activa:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user && (user.rendidor === 1 || esAdministrador())) {
        checkRendicionActiva();
      } else {
        setLoading(false);
      }
    }, [user, checkRendicionActiva, esAdministrador])
  );

  // Si el usuario no es rendidor ni administrador, mostrar mensaje
  if (user && user.rendidor !== 1 && !esAdministrador()) {
    return (
      <ThemedView style={stylesMenuCardRendiciones.container}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.noRendidorContainer}>
            <Ionicons name="lock-closed-outline" size={80} color="#ccc" />
            <Text style={styles.noRendidorTitle}>Acceso Restringido</Text>
            <Text style={styles.noRendidorText}>
              No tienes permisos de rendidor ni eres administrador. Contacta al administrador para obtener los permisos necesarios.
            </Text>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={stylesMenuCardRendiciones.container}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={MAIN_COLOR} />
            <Text style={styles.loadingText}>Verificando rendición...</Text>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const puedeCrearNuevaRendicion =
    !rendicionActiva ||
    (rendicionActiva &&
      (getRendicionEstado(rendicionActiva) === "APROBADA" ||
        getRendicionEstado(rendicionActiva) === "DENEGADA"));

  const menuOptions = [
    // Opciones para rendidores (solo si es rendidor o admin que también es rendidor)
    ...(user?.rendidor === 1 ? [
      {
        id: 1,
        title: "Mi Rendición",
        description: rendicionActiva
          ? `Estado: ${getRendicionEstado(rendicionActiva)}`
          : "No tienes rendición activa",
        icon: "document-text-outline" as keyof typeof Ionicons.glyphMap,
        onPress: () => {
          if (rendicionActiva) {
            router.push("/mi-rendicion");
          } else {
            Alert.alert(
              "Sin rendición",
              "No tienes una rendición activa. Crea una nueva rendición primero."
            );
          }
        },
        statusType: "default" as RendicionStatusType,
        disabled: !rendicionActiva,
      },
      ...(puedeCrearNuevaRendicion
        ? [
            {
              id: 4,
              title: "Nueva Rendición",
              description: "Crear una nueva rendición",
              icon: "add-circle-outline" as keyof typeof Ionicons.glyphMap,
              onPress: () => router.push("/create-rendicion" as any),
              statusType: "accent" as RendicionStatusType,
              disabled: false,
            },
          ]
        : []),
    ] : []),
    // Opción para administradores
    ...(esAdministrador()
      ? [
          {
            id: 5,
            title: "Panel de Administración",
            description: "Revisar y aprobar rendiciones pendientes",
            icon: "shield-checkmark-outline" as keyof typeof Ionicons.glyphMap,
            onPress: () => router.push("/rendiciones-por-revisar" as any),
            statusType: "admin" as RendicionStatusType,
            disabled: false,
          },
        ]
      : []),
  ];

  return (
    <ThemedView style={stylesMenuCardRendiciones.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
        >
          {rendicionActiva && user?.rendidor === 1 && (
            <View style={styles.rendicionActivaContainer}>
              <View style={styles.rendicionActivaHeader}>
                <View style={styles.headerLeft}>
                  <Ionicons name="wallet" size={24} color="white" />
                  <Text style={styles.rendicionActivaTitle}>
                    Mi Rendición Activa
                  </Text>
                </View>
                <View style={styles.estadoBadge}>
                  <Text style={styles.estadoBadgeText}>
                    {getRendicionEstado(rendicionActiva)}
                  </Text>
                </View>
              </View>

              {/* Resumen financiero */}
              <View style={styles.financialSummary}>
                <Text style={styles.summaryTitle}>Resumen Financiero</Text>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Saldo Inicial</Text>
                    <Text style={styles.summaryValuePositive}>
                      S/ {formatCurrency(rendicionActiva.total_iniciado)}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Rendido</Text>
                    <Text style={styles.summaryValueNeutral}>
                      S/ {formatCurrency(rendicionActiva.total_rendido)}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Saldo Actual</Text>
                    <Text
                      style={[
                        styles.summaryValue,
                        parseFloat(
                          formatCurrency(rendicionActiva.total_saldo)
                        ) >= 0
                          ? styles.summaryValuePositive
                          : styles.summaryValueNegative,
                      ]}
                    >
                      S/ {formatCurrency(rendicionActiva.total_saldo)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Fecha de creación */}
              <View style={styles.creationDateSection}>
                <Text style={styles.creationDateText}>
                  Creada el{" "}
                  {new Date(rendicionActiva.createdAt).toLocaleDateString(
                    "es-PE"
                  )}
                </Text>
              </View>

              {/* Datos bancarios desplegables */}
              {(rendicionActiva.banco ||
                rendicionActiva.cuentabancaria) && (
                <View style={styles.bankingSection}>
                  <TouchableOpacity
                    style={styles.bankingSectionHeader}
                    onPress={() => setShowBankingDetails(!showBankingDetails)}
                  >
                    <Text style={styles.sectionTitle}>
                      <Ionicons name="card" size={16} color={MAIN_COLOR} />{" "}
                      Datos Bancarios
                    </Text>
                    <Ionicons
                      name={showBankingDetails ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={MAIN_COLOR}
                    />
                  </TouchableOpacity>

                  {showBankingDetails && (
                    <View style={styles.bankingInfo}>
                      {rendicionActiva.banco && (
                        <View style={styles.bankingRow}>
                          <Text style={styles.bankingLabel}>
                            Banco/Billetera:
                          </Text>
                          <Text style={styles.bankingValue}>
                            {rendicionActiva.banco}
                          </Text>
                        </View>
                      )}
                      {rendicionActiva.cuentabancaria && (
                        <View style={styles.bankingRow}>
                          <Text style={styles.bankingLabel}>
                            Cuenta/Celular:
                          </Text>
                          <Text style={styles.bankingValue}>
                            {rendicionActiva.cuentabancaria}
                          </Text>
                        </View>
                      )}
                      {rendicionActiva.cci && (
                        <View style={styles.bankingRow}>
                          <Text style={styles.bankingLabel}>CCI:</Text>
                          <Text style={styles.bankingValue}>
                            {rendicionActiva.cci}
                          </Text>
                        </View>
                      )}
                      {rendicionActiva.titular && (
                        <View style={styles.bankingRow}>
                          <Text style={styles.bankingLabel}>Titular:</Text>
                          <Text style={styles.bankingValue}>
                            {rendicionActiva.titular}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Menú de opciones */}
          <View style={stylesMenuCardRendiciones.menuSection}>
            {menuOptions.map((option) => (
              <MenuCardRendiciones
                key={option.id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                onPress={option.onPress}
                statusType={option.statusType}
                disabled={option.disabled}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = {
  noRendidorContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 40,
  },
  noRendidorTitle: {
    fontSize: 24,
    fontWeight: "600" as const,
    color: "#333",
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center" as const,
  },
  noRendidorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center" as const,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },

  // Nuevo diseño para rendición activa
  rendicionActivaContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden" as const,
  },
  rendicionActivaHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between" as const,
  },
  headerLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  rendicionActivaTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "white",
    marginLeft: 12,
  },
  estadoBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estadoBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
  },

  // Resumen financiero
  financialSummary: {
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#333",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center" as const,
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textAlign: "center" as const,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    textAlign: "center" as const,
  },
  summaryValuePositive: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#10B981",
    textAlign: "center" as const,
  },
  summaryValueNegative: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#EF4444",
    textAlign: "center" as const,
  },
  summaryValueNeutral: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#6B7280",
    textAlign: "center" as const,
  },

  // Fecha de creación
  creationDateSection: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  creationDateText: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic" as const,
  },

  // Secciones
  bankingSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  bankingSectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: MAIN_COLOR,
    marginBottom: 16,
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },

  // Información bancaria
  bankingInfo: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bankingRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  bankingLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500" as const,
    flex: 1,
  },
  bankingValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600" as const,
    flex: 1,
    textAlign: "right" as const,
  },
};
