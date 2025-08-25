import { obtenerGasto } from "@/api/gastos/gastos-api";
import { API_URL_BASE } from "@/app/backend";
import { MAIN_COLOR } from "@/app/constants";
import PagoCard from "@/components/gastos/PagoCard";
import { stylesGastoDetalle } from "@/styles/gastos/gasto-detalle.styles";
import {
    EtiquetaGasto,
    Gasto,
    GastoFile,
    Moneda,
    Pago,
} from "@/types/gastos/gastos.types";
import {
    downloadFile,
    getBadgeColor,
    getFileIcon,
    truncateFileName,
} from "@/utils/gastos/create-gasto-utils";
import { formatDisplayText } from "@/utils/gastos/custom_selector_create_update_gasto.utils";
import { getEstadoColor } from "@/utils/gastos/list-gastos-utils";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// Función para verificar si un archivo es imagen
const isImageFile = (filename: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExtensions.some((ext) => filename.toLowerCase().includes(ext));
};

export default function GastoDetalle() {
  const params = useLocalSearchParams();
  const gastoId = params.id as string;

  const [gasto, setGasto] = useState<Gasto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Pagos desplegados por defecto en detalle

  // Animación para las waves
  const animatedValue = React.useMemo(() => new Animated.Value(0), []);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  // Helper function para formatear importe de forma segura
  const formatImporte = (
    importe: number | string | null | undefined
  ): string => {
    if (importe === null || importe === undefined) return "0.00";
    const num = typeof importe === "string" ? parseFloat(importe) : importe;
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Helper function para obtener el símbolo de la moneda
  const getMonedaSymbol = (
    moneda: Moneda | string | null | undefined
  ): string => {
    switch (moneda) {
      case Moneda.SOLES:
      case "SOLES":
        return "S/";
      case Moneda.DOLARES:
      case "DOLARES":
        return "US$";
      case Moneda.PESOS_COLOMBIANOS:
      case "PESOS_COLOMBIANOS":
        return "COP$";
      default:
        return moneda?.toString() || "";
    }
  };

  // Función para calcular el total de pagos
  const calcularTotalPagos = (): number => {
    if (!gasto?.pagos || gasto.pagos.length === 0) return 0;
    return gasto.pagos.reduce((total, pago) => {
      const importePago =
        typeof pago.importe === "string"
          ? parseFloat(pago.importe)
          : pago.importe || 0;
      return total + (isNaN(importePago) ? 0 : importePago);
    }, 0);
  };

  // Función para calcular el saldo
  const calcularSaldo = (): number => {
    if (!gasto) return 0;
    const importeGasto =
      typeof gasto.importe === "string"
        ? parseFloat(gasto.importe)
        : gasto.importe || 0;
    const totalPagos = calcularTotalPagos();
    return (isNaN(importeGasto) ? 0 : importeGasto) - totalPagos;
  };

  const saldo = calcularSaldo();
  const estadoColor = getEstadoColor(gasto?.estado || "PENDIENTE");

  const loadGasto = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerGasto(parseInt(gastoId));
      setGasto(data as Gasto);
    } catch (error) {
      console.error("Error cargando gasto:", error);
      Alert.alert("Error", "No se pudo cargar el gasto");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [gastoId]);

  useFocusEffect(
    useCallback(() => {
      if (gastoId) {
        loadGasto();
      }
    }, [gastoId, loadGasto])
  );

  const openImageModal = (uri: string) => {
    setSelectedImageUri(uri);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageUri(null);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  const handleRegistrarPago = () => {
    closeMenu();
    router.push({
      pathname: "/create-update-pago",
      params: { gastoId: gasto?.id },
    });
  };

  const handleCopiarWhatsApp = async () => {
    closeMenu();
    if (!gasto) return;

    // Crear el mensaje formateado para WhatsApp
    const fecha = new Date(gasto.fechaRegistro || "").toLocaleDateString(
      "es-ES"
    );
    const hora = new Date(gasto.fechaRegistro || "").toLocaleTimeString(
      "es-ES",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const categoria = gasto.subcategoria
      ? `${formatDisplayText(gasto.categoria || "")} > ${formatDisplayText(
          gasto.subcategoria
        )}`
      : formatDisplayText(gasto.categoria || "");

    const etiquetas =
      gasto.etiquetas && gasto.etiquetas.length > 0
        ? gasto.etiquetas
            .map((e) => e?.etiqueta?.nombre)
            .filter(Boolean)
            .join(", ")
        : "";

    let mensaje = `💰 *GASTO REGISTRADO*\n\n`;
    mensaje += `🔢 *Código:* #G${gasto.id}\n`;
    mensaje += `📋 *Descripción:* ${gasto.descripcion}\n`;
    mensaje += `📂 *Categoría:* ${categoria}\n`;
    mensaje += `💵 *Importe:* ${getMonedaSymbol(gasto.moneda)} ${
      gasto.importe
    }\n`;
    mensaje += `📅 *Fecha:* ${fecha} ${hora}\n`;
    mensaje += `👤 *Creado por:* ${gasto.usuarioRegistroGastoNombre}\n`;
    mensaje += `🏷️ *Estado:* ${gasto.estado}\n`;

    if (etiquetas) {
      mensaje += `🏷️ *Etiquetas:* ${etiquetas}\n`;
    }

    if (gasto.observaciones) {
      mensaje += `📝 *Observaciones:* ${gasto.observaciones}\n`;
    }

    if (gasto.archivos && gasto.archivos.length > 0) {
      mensaje += `📎 *Archivos adjuntos:* ${gasto.archivos.length}\n`;
    }

    if (gasto.pagos && gasto.pagos.length > 0) {
      mensaje += `💳 *Pagos registrados:* ${gasto.pagos.length}\n`;
      gasto.pagos.forEach((pago, index) => {
        const importePago = formatImporte(pago.importe);
        const monedaPago = pago.moneda === Moneda.SOLES ? "S/" : "$";
        mensaje += `   ${index + 1}. ${
          pago.tipo
        } - ${monedaPago} ${importePago}`;
        if (pago.numeroOperacion) {
          mensaje += ` (Op: ${pago.numeroOperacion})`;
        }
        mensaje += `\n`;
      });
    }

    try {
      await Clipboard.setStringAsync(mensaje);
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(mensaje)}`;
      const supported = await Linking.canOpenURL(whatsappUrl);

      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert(
          "Mensaje copiado",
          "El mensaje ha sido copiado al portapapeles. WhatsApp no está instalado en este dispositivo.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error al copiar o abrir WhatsApp:", error);
      Alert.alert("Error", "No se pudo copiar el mensaje al portapapeles.", [
        { text: "OK" },
      ]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={stylesGastoDetalle.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View style={stylesGastoDetalle.loadingContainer}>
          <ActivityIndicator size="large" color={MAIN_COLOR} />
          <Text style={stylesGastoDetalle.loadingText}>
            Cargando detalle del gasto...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!gasto) {
    return (
      <SafeAreaView style={stylesGastoDetalle.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View style={stylesGastoDetalle.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={stylesGastoDetalle.emptyText}>Gasto no encontrado</Text>
          <TouchableOpacity
            style={stylesGastoDetalle.backButton}
            onPress={() => router.back()}
          >
            <Text style={stylesGastoDetalle.backButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        stylesGastoDetalle.container,
        { backgroundColor: `${estadoColor}08` },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={`${estadoColor}08`} />

      {/* Background con waves del color del estado */}
      <View style={stylesGastoDetalle.waveContainer}>
        <Animated.View
          style={[
            stylesGastoDetalle.wave,
            {
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width],
                  }),
                },
              ],
            },
          ]}
        >
          <Svg height="100%" width={width * 2} viewBox="0 0 1200 120">
            <Path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill={`${estadoColor}15`}
            />
          </Svg>
        </Animated.View>
        <Animated.View
          style={[
            stylesGastoDetalle.wave,
            {
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width],
                  }),
                },
              ],
            },
            { opacity: 0.6 },
          ]}
        >
          <Svg height="100%" width={width * 2} viewBox="0 0 1200 120">
            <Path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill={`${estadoColor}10`}
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Header */}
      <View
        style={[
          stylesGastoDetalle.header,
          { backgroundColor: `${estadoColor}08` },
        ]}
      >
        <TouchableOpacity
          style={stylesGastoDetalle.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
        <Text style={stylesGastoDetalle.headerTitle}>
          Detalle del Gasto #{gasto?.id ? `G${gasto.id}` : ""}
        </Text>
        <TouchableOpacity
          style={stylesGastoDetalle.menuButton}
          onPress={toggleMenu}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
      </View>

      {/* Menú desplegable */}
      {isMenuVisible && (
        <TouchableOpacity
          style={stylesGastoDetalle.menuOverlay}
          onPress={closeMenu}
          activeOpacity={1}
        >
          <View style={stylesGastoDetalle.menuDropdown}>
            <TouchableOpacity
              style={stylesGastoDetalle.menuOption}
              onPress={handleRegistrarPago}
            >
              <Ionicons name="card-outline" size={16} color="#3B82F6" />
              <Text style={stylesGastoDetalle.menuOptionText}>
                Registrar Pago
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={stylesGastoDetalle.menuOption}
              onPress={handleCopiarWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
              <Text style={stylesGastoDetalle.menuOptionText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <ScrollView
        style={stylesGastoDetalle.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal del gasto */}
        <View style={stylesGastoDetalle.card}>
          {/* Código del gasto y Estado Badge */}
          <View style={stylesGastoDetalle.codigoEstadoContainer}>
            <View style={stylesGastoDetalle.codigoContainer}>
              <Text style={stylesGastoDetalle.codigoText}>#G{gasto.id}</Text>
            </View>
            <View style={stylesGastoDetalle.estadoBadge}>
              <Ionicons name="ellipse" size={8} color={estadoColor} />
              <Text
                style={[
                  stylesGastoDetalle.estadoBadgeText,
                  { color: estadoColor },
                ]}
              >
                {gasto.estado}
              </Text>
            </View>
          </View>

          {/* Categoría/Subcategoría */}
          <View style={stylesGastoDetalle.breadcrumbContainer}>
            <Text style={stylesGastoDetalle.breadcrumbText}>
              {formatDisplayText(gasto.categoria || "")}
            </Text>
            {gasto.subcategoria && (
              <>
                <Text style={stylesGastoDetalle.breadcrumbSeparator}>
                  {" > "}
                </Text>
                <Text style={stylesGastoDetalle.breadcrumbSubText}>
                  {formatDisplayText(gasto.subcategoria)}
                </Text>
              </>
            )}
          </View>

          {/* Descripción */}
          <Text style={stylesGastoDetalle.descripcion}>
            {gasto.descripcion}
          </Text>

          {/* Observaciones */}
          {gasto.observaciones && (
            <Text style={stylesGastoDetalle.observaciones}>
              {gasto.observaciones}
            </Text>
          )}

          {/* Información del Proveedor */}
          {gasto.proveedor && (
            <View style={stylesGastoDetalle.proveedorContainer}>
              <View style={stylesGastoDetalle.proveedorHeader}>
                <Ionicons name="business-outline" size={16} color={MAIN_COLOR} />
                <Text style={stylesGastoDetalle.proveedorText}>
                  {gasto.proveedor}
                </Text>
              </View>
            </View>
          )}

          {/* Importe y Saldo */}
          <View style={stylesGastoDetalle.importeSaldoContainer}>
            <View style={stylesGastoDetalle.importeContainer}>
              <Text style={stylesGastoDetalle.monedaText}>
                {getMonedaSymbol(gasto.moneda)}
              </Text>
              <Text style={stylesGastoDetalle.importeText}>
                {gasto.importe}
              </Text>
            </View>
            <View style={stylesGastoDetalle.saldoContainer}>
              <Text style={stylesGastoDetalle.saldoLabel}>Saldo:</Text>
              <Text
                style={[
                  stylesGastoDetalle.saldoText,
                  {
                    color:
                      saldo > 0 ? "#dc3545" : saldo < 0 ? "#28a745" : "#6c757d",
                  },
                ]}
              >
                {getMonedaSymbol(gasto.moneda)} {formatImporte(saldo)}
              </Text>
            </View>
          </View>

          {/* Etiquetas */}
          {gasto.etiquetas && gasto.etiquetas.length > 0 && (
            <View style={stylesGastoDetalle.etiquetasContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={stylesGastoDetalle.etiquetasScroll}
              >
                {gasto.etiquetas.map(
                  (etiqueta: EtiquetaGasto, index: number) => (
                    <View
                      key={index}
                      style={[
                        stylesGastoDetalle.etiquetaBadge,
                        {
                          backgroundColor: getBadgeColor(
                            etiqueta?.etiqueta?.nombre || ""
                          ),
                        },
                      ]}
                    >
                      <Text style={stylesGastoDetalle.etiquetaText}>
                        {etiqueta?.etiqueta?.nombre}
                      </Text>
                    </View>
                  )
                )}
              </ScrollView>
            </View>
          )}

          {/* Archivos */}
          {gasto.archivos && gasto.archivos.length > 0 && (
            <View style={stylesGastoDetalle.archivosContainer}>
              <Text style={stylesGastoDetalle.archivosLabel}>
                Archivos ({gasto.archivos.length}):
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={stylesGastoDetalle.archivosScroll}
              >
                {gasto.archivos.map((archivo: GastoFile, index: number) => (
                  <View key={index} style={stylesGastoDetalle.archivoItem}>
                    {isImageFile(archivo.filename || "") ? (
                      <TouchableOpacity
                        style={stylesGastoDetalle.imageContainer}
                        onPress={() =>
                          openImageModal(`${API_URL_BASE}/${archivo.filename}`)
                        }
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{
                            uri: `${API_URL_BASE}/${archivo.filename}`,
                          }}
                          style={stylesGastoDetalle.archivoImage}
                          resizeMode="cover"
                        />
                        <View style={stylesGastoDetalle.imageOverlay}>
                          <Ionicons name="expand" size={14} color="white" />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={stylesGastoDetalle.documentContainer}
                        onPress={() =>
                          downloadFile(
                            `${API_URL_BASE}/${archivo.filename}`,
                            archivo.filename || "archivo"
                          )
                        }
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={getFileIcon(archivo.filename || "")}
                          size={28}
                          color={MAIN_COLOR}
                        />
                        <Text
                          style={stylesGastoDetalle.documentText}
                          numberOfLines={1}
                        >
                          {truncateFileName(archivo.filename || "")}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Usuario, Fecha y Estado */}
          <View style={stylesGastoDetalle.footerContainer}>
            <View style={stylesGastoDetalle.usuarioFechaContainer}>
              <View style={stylesGastoDetalle.usuarioContainer}>
                <Ionicons name="person-circle" size={18} color="#8A9A97" />
                <Text style={stylesGastoDetalle.creadorLabel}>
                  Creado por {gasto.usuarioRegistroGastoNombre}
                </Text>
              </View>
              <View style={stylesGastoDetalle.fechaContainer}>
                <Ionicons name="time" size={16} color="#94A3B8" />
                <Text style={stylesGastoDetalle.registradoLabel}>
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
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Sección de Pagos integrada */}
          {gasto.pagos && gasto.pagos.length > 0 && (
            <View style={stylesGastoDetalle.pagosIntegrados}>
              <View style={stylesGastoDetalle.pagosDivider} />
              <TouchableOpacity
                style={stylesGastoDetalle.pagosHeader}
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <Ionicons name="card" size={18} color={estadoColor} />
                <Text
                  style={[
                    stylesGastoDetalle.pagosTitle,
                    { color: estadoColor },
                  ]}
                >
                  Pagos Registrados ({gasto.pagos.length})
                </Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={estadoColor}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={stylesGastoDetalle.pagosListaContainer}>
                  {gasto.pagos.map((pago: Pago, index: number) => (
                    <View
                      key={pago.id || index}
                      style={stylesGastoDetalle.pagoItemIntegrado}
                    >
                      <PagoCard 
                        pago={pago} 
                        index={index} 
                        proveedorInfo={{
                          nombre: gasto.proveedor,
                          banco: gasto.proveedor_banco,
                          cuenta: gasto.proveedor_cuenta,
                          cci: gasto.proveedor_cci
                        }}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Botón Pagar (condicional) */}
        {saldo > 0 && (
          <View style={stylesGastoDetalle.pagarContainer}>
            <TouchableOpacity
              style={stylesGastoDetalle.pagarButton}
              onPress={handleRegistrarPago}
            >
              <Ionicons name="card-outline" size={20} color="white" />
              <Text style={stylesGastoDetalle.pagarButtonText}>
                Registrar Pago - Saldo: {getMonedaSymbol(gasto.moneda)}{" "}
                {formatImporte(saldo)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal para imagen en pantalla completa */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={isImageModalVisible}
        onRequestClose={closeImageModal}
      >
        <SafeAreaView style={stylesGastoDetalle.imageModalContainer}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="black"
            translucent={false}
          />
          <View style={stylesGastoDetalle.imageModalHeader}>
            <TouchableOpacity
              style={stylesGastoDetalle.closeModalButton}
              onPress={closeImageModal}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={stylesGastoDetalle.imageZoomScrollView}
            contentContainerStyle={stylesGastoDetalle.imageZoomContainer}
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
                style={stylesGastoDetalle.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
