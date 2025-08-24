import { listarGastos } from "@/api/gastos/gastos-api";
import { API_URL_BASE } from "@/app/backend";
import { MAIN_COLOR } from "@/app/constants";
import { EtiquetaGasto, Gasto, GastoFile } from "@/types/gastos/gastos.types";
import { getBadgeColor } from "@/utils/gastos/create-gasto-utils";
import { formatDisplayText } from "@/utils/gastos/custom_selector_create_update_gasto.utils";
import { getEstadoColor } from "@/utils/gastos/list-gastos-utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { stylesListGastos } from "../../styles/gastos/list-gastos.styles";

// Función para verificar si un archivo es imagen
const isImageFile = (filename: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExtensions.some((ext) => filename.toLowerCase().includes(ext));
};

interface GastoCardProps {
  gasto: Gasto;
  onPress?: () => void;
}

const GastoCard: React.FC<GastoCardProps> = ({ gasto, onPress }) => {
  const estadoColor = getEstadoColor(gasto.estado || "PENDIENTE");

  return (
    <TouchableOpacity
      style={[
        stylesListGastos.card,
        { backgroundColor: `${estadoColor}11` }, // Color muy sutil (11 = ~6% opacity)
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Wave Pattern */}
      <View style={stylesListGastos.waveContainer}>
        <View
          style={[
            stylesListGastos.wave1,
            { backgroundColor: `${estadoColor}12` },
          ]}
        />
        <View
          style={[
            stylesListGastos.wave2,
            { backgroundColor: `${estadoColor}08` },
          ]}
        />
      </View>

      {/* Header con Categoría/Subcategoría y Estado */}
      <View style={stylesListGastos.cardHeader}>
        <View style={stylesListGastos.breadcrumbContainer}>
          <Text style={stylesListGastos.breadcrumbText}>
            {formatDisplayText(gasto.categoria || "")}
          </Text>
          {gasto.subcategoria && (
            <>
              <Text style={stylesListGastos.breadcrumbSeparator}>{" > "}</Text>
              <Text style={stylesListGastos.breadcrumbSubText}>
                {formatDisplayText(gasto.subcategoria)}
              </Text>
            </>
          )}
        </View>
        <View style={stylesListGastos.estadoContainerHeader}>
          <View
            style={[
              stylesListGastos.estadoIndicatorSmall,
              { backgroundColor: estadoColor },
            ]}
          />
          <Text style={[stylesListGastos.estadoTextSmall, { color: estadoColor }]}>
            {gasto.estado}
          </Text>
        </View>
      </View>

      {/* Descripción */}
      <Text style={stylesListGastos.descripcion} numberOfLines={2}>
        {gasto.descripcion}
      </Text>

      {/* Importe */}
      <View style={stylesListGastos.importeContainer}>
        <Text style={stylesListGastos.monedaText}>{gasto.moneda}</Text>
        <Text style={stylesListGastos.importeText}>{gasto.importe}</Text>
      </View>

      {/* Etiquetas */}
      {gasto.etiquetas && gasto.etiquetas.length > 0 && (
        <View style={stylesListGastos.etiquetasContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={stylesListGastos.etiquetasScroll}
          >
            {gasto.etiquetas.map((etiqueta: EtiquetaGasto, index: number) => (
              <View
                key={index}
                style={[
                  stylesListGastos.etiquetaBadge,
                  {
                    backgroundColor: getBadgeColor(
                      etiqueta?.etiqueta?.nombre || "Sin nombre"
                    ),
                  },
                ]}
              >
                <Text style={stylesListGastos.etiquetaBadgeText}>
                  {etiqueta?.etiqueta?.nombre || "Sin nombre"}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Archivos */}
      {gasto.archivos && gasto.archivos.length > 0 && (
        <View style={stylesListGastos.archivosContainer}>
          <Text style={stylesListGastos.archivosLabel}>
            Archivos ({gasto.archivos.length}):
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={stylesListGastos.archivosScroll}
          >
            {gasto.archivos.map((archivo: GastoFile, index: number) => (
              <View key={index} style={stylesListGastos.archivoItem}>
                {isImageFile(archivo.filename || "") ? (
                  <View style={stylesListGastos.imageContainer}>
                    <Image
                      source={{
                        uri: `${API_URL_BASE}/${archivo.filename}`,
                      }}
                      style={stylesListGastos.archivoImage}
                      resizeMode="cover"
                    />
                    <View style={stylesListGastos.imageOverlay}>
                      <Ionicons name="image" size={16} color="white" />
                    </View>
                  </View>
                ) : (
                  <View style={stylesListGastos.documentContainer}>
                    <Ionicons name="document" size={24} color={MAIN_COLOR} />
                    <Text
                      style={stylesListGastos.documentText}
                      numberOfLines={1}
                    >
                      {(archivo.filename || "").split("/").pop()?.split(".")[0]}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Usuario, Fecha y Estado */}
      <View style={stylesListGastos.footerContainer}>
        <View style={stylesListGastos.usuarioFechaContainer}>
          <View style={stylesListGastos.usuarioContainer}>
            <Ionicons name="person-circle" size={18} color="#8A9A97" />
            <Text style={stylesListGastos.creadorLabel}>
              Creado por {gasto.usuarioRegistroGastoNombre}{" "}
            </Text>
          </View>
          <View style={stylesListGastos.fechaContainer}>
            <Ionicons name="time" size={16} color="#94A3B8" />
            <Text style={stylesListGastos.registradoLabel}>
              Registrado el{" "}
              {new Date(gasto.fechaRegistro || "").toLocaleDateString(
                "es-ES"
              )}{" "}
              {new Date(gasto.fechaRegistro || "").toLocaleTimeString(
                "es-ES",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}{" "}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
