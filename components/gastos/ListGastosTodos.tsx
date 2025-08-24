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
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
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
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const openImageModal = (uri: string) => {
    setSelectedImageUri(uri);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageUri(null);
  };

  return (
    <View
      style={[
        stylesListGastos.card,
        { backgroundColor: `${estadoColor}11` }, // Color muy sutil (11 = ~6% opacity)
      ]}
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

      {/* Estado Badge arriba del título */}
      <View style={stylesListGastos.estadoBadgeContainer}>
        <View style={stylesListGastos.estadoBadge}>
          <Ionicons name="ellipse" size={8} color={estadoColor} />
          <Text style={[stylesListGastos.estadoBadgeText, { color: estadoColor }]}>
            {gasto.estado}
          </Text>
        </View>
      </View>

      {/* Header con Categoría/Subcategoría */}
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
                  <TouchableOpacity
                    style={stylesListGastos.imageContainer}
                    onPress={() =>
                      openImageModal(`${API_URL_BASE}/${archivo.filename}`)
                    }
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{
                        uri: `${API_URL_BASE}/${archivo.filename}`,
                      }}
                      style={stylesListGastos.archivoImage}
                      resizeMode="cover"
                    />
                    <View style={stylesListGastos.imageOverlay}>
                      <Ionicons name="expand" size={16} color="white" />
                    </View>
                  </TouchableOpacity>
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
              {new Date(gasto.fechaRegistro || "").toLocaleDateString("es-ES")}{" "}
              {new Date(gasto.fechaRegistro || "").toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
            </Text>
          </View>
        </View>
      </View>

      {/* Botón de acción en inferior derecha */}
      <TouchableOpacity
        style={stylesListGastos.actionButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-forward" size={16} color="#64748B" />
      </TouchableOpacity>

      {/* Modal para vista previa de imagen con zoom */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <SafeAreaView style={stylesListGastos.imageModalContainer}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="rgba(0,0,0,0.9)"
          />

          {/* Header del modal */}
          <View style={stylesListGastos.imageModalHeader}>
            <TouchableOpacity
              style={stylesListGastos.closeModalButton}
              onPress={closeImageModal}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Imagen con zoom */}
          <ScrollView
            style={stylesListGastos.imageZoomScrollView}
            contentContainerStyle={stylesListGastos.imageZoomContainer}
            maximumZoomScale={4}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={true}
            bouncesZoom={true}
            pinchGestureEnabled={true}
            scrollEnabled={true}
            centerContent={true}
          >
            {selectedImageUri && (
              <Image
                source={{ uri: selectedImageUri }}
                style={stylesListGastos.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
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
