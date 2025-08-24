import { listarGastos } from "@/api/gastos/gastos-api";
import { MAIN_COLOR } from "@/app/constants";
import { EtiquetaGasto, Gasto, GastoFile } from "@/types/gastos/gastos.types";
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

// Función para generar color basado en el nombre de la etiqueta
const getBadgeColor = (nombre: string | null): string => {
  if (!nombre) return MAIN_COLOR;

  const colors = [
    "#D63031",
    "#00B894",
    "#0984E3",
    "#6C5CE7",
    "#FD79A8",
    "#E17055",
    "#00CEC9",
    "#A29BFE",
    "#74B9FF",
    "#FDCB6E",
    "#EE5A24",
    "#5F27CD",
    "#E84393",
    "#00D2D3",
    "#FF7675",
    "#2D3436",
    "#636E72",
    "#00B894",
    "#0984E3",
    "#6C5CE7",
  ];

  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    const char = nombre.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return colors[Math.abs(hash) % colors.length];
};

// Función para obtener el color del estado
const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case "PENDIENTE":
      return "#F39C12";
    case "FINALIZADO":
      return "#27AE60";
    case "RECHAZADO":
      return "#E74C3C";
    default:
      return "#95A5A6";
  }
};

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

      {/* Header con estado */}
      <View style={stylesListGastos.cardHeader}>
        <View style={stylesListGastos.estadoContainer}>
          <View
            style={[
              stylesListGastos.estadoIndicator,
              { backgroundColor: estadoColor },
            ]}
          />
          <Text style={[stylesListGastos.estadoText, { color: estadoColor }]}>
            {gasto.estado}
          </Text>
        </View>
        <Text style={stylesListGastos.fechaText}>
          {new Date(gasto.fechaRegistro || "").toLocaleDateString("es-ES")}{" "}
          {new Date(gasto.fechaRegistro || "").toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Descripción */}
      <Text style={stylesListGastos.descripcion} numberOfLines={2}>
        {gasto.descripcion}
      </Text>

      {/* Categoría y Subcategoría */}
      <View style={stylesListGastos.categoriaContainer}>
        <View style={stylesListGastos.categoriaBadge}>
          <Text style={stylesListGastos.categoriaText}>{gasto.categoria}</Text>
        </View>
        {gasto.subcategoria && (
          <View style={stylesListGastos.subcategoriaBadge}>
            <Text style={stylesListGastos.subcategoriaText}>
              {gasto.subcategoria}
            </Text>
          </View>
        )}
      </View>

      {/* Importe */}
      <View style={stylesListGastos.importeContainer}>
        <Text style={stylesListGastos.monedaText}>{gasto.moneda}</Text>
        <Text style={stylesListGastos.importeText}>{gasto.importe}</Text>
      </View>

      {/* Etiquetas */}
      {gasto.etiquetas && gasto.etiquetas.length > 0 && (
        <View style={stylesListGastos.etiquetasContainer}>
          <Text style={stylesListGastos.etiquetasLabel}>Etiquetas:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={stylesListGastos.etiquetasScroll}
          >
            {gasto.etiquetas.map(
              (etiquetaGasto: EtiquetaGasto, index: number) => (
                <View
                  key={index}
                  style={[
                    stylesListGastos.etiquetaBadge,
                    {
                      backgroundColor: getBadgeColor(
                        etiquetaGasto.etiqueta?.nombre || "Sin nombre"
                      ),
                    },
                  ]}
                >
                  <Text style={stylesListGastos.etiquetaBadgeText}>
                    {etiquetaGasto.etiqueta?.nombre || "Sin nombre"}
                  </Text>
                </View>
              )
            )}
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
                {isImageFile(archivo.nombreArchivo || "") ? (
                  <View style={stylesListGastos.imageContainer}>
                    <Image
                      source={{
                        uri: `http://localhost:3100/${archivo.rutaArchivo}`,
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
                      {
                        (archivo.nombreArchivo || "")
                          .split("/")
                          .pop()
                          ?.split(".")[0]
                      }
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Usuario */}
      <View style={stylesListGastos.usuarioContainer}>
        <Ionicons name="person-circle" size={16} color="#8A9A97" />
        <Text style={stylesListGastos.usuarioText}>
          {gasto.usuarioRegistroGastoNombre}
        </Text>
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
