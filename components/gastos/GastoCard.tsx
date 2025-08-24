import { API_URL_BASE } from "@/app/backend";
import { MAIN_COLOR } from "@/app/constants";
import {
    EtiquetaGasto,
    Gasto,
    GastoFile,
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
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
    Alert,
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
import { stylesListGastos } from "../../styles/gastos/list-gastos.styles";
import ModalRegistrarPago from "./ModalRegistrarPago";

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
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isPagoModalVisible, setIsPagoModalVisible] = useState(false);

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

  const handlePagar = () => {
    closeMenu();
    setIsPagoModalVisible(true);
  };

  const handleEditar = () => {
    closeMenu();
    console.log("Editar gasto:", gasto.id);
    // TODO: Navegar a pantalla de edición
  };

  const handleVerMas = () => {
    closeMenu();
    console.log("Ver más detalles gasto:", gasto.id);
    if (onPress) onPress();
  };

  const handleCopiarWhatsApp = async () => {
    closeMenu();

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
    mensaje += `📋 *Descripción:* ${gasto.descripcion}\n`;
    mensaje += `📂 *Categoría:* ${categoria}\n`;
    mensaje += `💵 *Importe:* ${gasto.moneda} ${gasto.importe}\n`;
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

    try {
      // Copiar al portapapeles usando expo-clipboard
      await Clipboard.setStringAsync(mensaje);

      // Intentar abrir WhatsApp
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(mensaje)}`;

      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Si no tiene WhatsApp instalado, mostrar mensaje copiado
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
          <Text
            style={[stylesListGastos.estadoBadgeText, { color: estadoColor }]}
          >
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

      {/* Observaciones */}
      {gasto.observaciones && (
        <Text style={stylesListGastos.observaciones} numberOfLines={3}>
          {gasto.observaciones}
        </Text>
      )}

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
                  <TouchableOpacity
                    style={stylesListGastos.documentContainer}
                    onPress={() =>
                      downloadFile(
                        `${API_URL_BASE}/${archivo.filename}`,
                        archivo.filename || "archivo"
                      )
                    }
                    activeOpacity={0.8}
                  >
                    {/* Ícono del archivo */}
                    <Ionicons
                      name={getFileIcon(archivo.filename || "")}
                      size={35}
                      color={MAIN_COLOR}
                    />

                    {/* Nombre del archivo */}
                    <Text
                      style={stylesListGastos.documentText}
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

      {/* Menú de tres puntos en lugar del botón de acción */}
      <View style={stylesListGastos.menuContainer}>
        <TouchableOpacity
          style={stylesListGastos.menuButton}
          onPress={toggleMenu}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Menú dropdown */}
        {isMenuVisible && (
          <>
            {/* Overlay para cerrar el menú */}
            <TouchableOpacity
              style={stylesListGastos.menuOverlay}
              onPress={closeMenu}
              activeOpacity={1}
            />

            {/* Opciones del menú */}
            <View style={stylesListGastos.menuDropdown}>
              <TouchableOpacity
                style={stylesListGastos.menuOption}
                onPress={handlePagar}
                activeOpacity={0.7}
              >
                <Ionicons name="card-outline" size={16} color="#10B981" />
                <Text style={stylesListGastos.menuOptionText}>Pagar</Text>
              </TouchableOpacity>

              <View style={stylesListGastos.menuSeparator} />

              <TouchableOpacity
                style={stylesListGastos.menuOption}
                onPress={handleEditar}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color="#3B82F6" />
                <Text style={stylesListGastos.menuOptionText}>Editar</Text>
              </TouchableOpacity>

              <View style={stylesListGastos.menuSeparator} />

              <TouchableOpacity
                style={stylesListGastos.menuOption}
                onPress={handleVerMas}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={16} color="#6B7280" />
                <Text style={stylesListGastos.menuOptionText}>Ver más</Text>
              </TouchableOpacity>

              <View style={stylesListGastos.menuSeparator} />

              <TouchableOpacity
                style={stylesListGastos.menuOption}
                onPress={handleCopiarWhatsApp}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                <Text style={stylesListGastos.menuOptionText}>Whatsapp</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

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

      {/* Modal para registrar pago */}
      <ModalRegistrarPago 
        visible={isPagoModalVisible}
        onClose={() => setIsPagoModalVisible(false)}
        gasto={gasto}
      />
    </View>
  );
};

export default GastoCard;
