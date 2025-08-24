import { API_URL_BASE } from "@/app/backend";
import { MAIN_COLOR } from "@/app/constants";
import {
    Moneda,
    OrigenPago,
    Pago,
    PagoFile,
    TipoPago,
} from "@/types/gastos/gastos.types";
import {
    downloadFile,
    getFileIcon,
    truncateFileName,
} from "@/utils/gastos/create-gasto-utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { stylesListGastos } from "../../styles/gastos/list-gastos.styles";

interface PagoCardProps {
  pago: Pago;
  index: number;
}

const PagoCard: React.FC<PagoCardProps> = ({ pago, index }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  // Helper function para formatear importe de forma segura
  const formatImporte = (
    importe: number | string | null | undefined
  ): string => {
    if (importe === null || importe === undefined) return "0.00";
    const num = typeof importe === "string" ? parseFloat(importe) : importe;
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Función para verificar si es un archivo de imagen
  const isImageFile = (filename: string): boolean => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  // Función para abrir modal de imagen
  const openImageModal = (imageUri: string) => {
    setSelectedImageUri(imageUri);
    setIsImageModalVisible(true);
  };

  // Función para cerrar modal de imagen
  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageUri(null);
  };

  return (
    <>
      <View key={pago.id || index} style={stylesListGastos.pagoItem}>
        <View style={stylesListGastos.pagoHeader}>
          <View style={stylesListGastos.pagoTipoOrigenContainer}>
            <View style={stylesListGastos.pagoTipoBadge}>
              <Ionicons
                name={
                  pago.tipo === TipoPago.TRANSFERENCIA
                    ? "card-outline"
                    : pago.tipo === TipoPago.EFECTIVO
                    ? "cash-outline"
                    : pago.tipo === TipoPago.YAPE || pago.tipo === TipoPago.PLIN
                    ? "phone-portrait-outline"
                    : "wallet-outline"
                }
                size={12}
                color="#3B82F6"
              />
              <Text style={stylesListGastos.pagoTipoText}>{pago.tipo}</Text>
            </View>
            <View style={stylesListGastos.pagoOrigenBadge}>
              <Text style={stylesListGastos.pagoOrigenText}>
                {pago.origen === OrigenPago.CUENTA_EMPRESA
                  ? "Cuenta Empresa"
                  : "Externo"}
              </Text>
            </View>
          </View>
        </View>

        <View style={stylesListGastos.pagoImporteContainer}>
          <Text style={stylesListGastos.pagoImporte}>
            {pago.moneda === Moneda.SOLES ? "S/" : "$"}{" "}
            {formatImporte(pago.importe)}
          </Text>
        </View>

        {/* Archivos del pago */}
        {pago.archivos && pago.archivos.length > 0 && (
          <View style={stylesListGastos.pagoArchivosContainer}>
            <Text style={stylesListGastos.pagoArchivosLabel}>
              Archivos ({pago.archivos.length}):
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={stylesListGastos.pagoArchivosScroll}
            >
              {pago.archivos.map((archivo: PagoFile, archivoIndex: number) => (
                <View
                  key={archivoIndex}
                  style={stylesListGastos.pagoArchivoItem}
                >
                  {isImageFile(archivo.filename || "") ? (
                    <TouchableOpacity
                      style={stylesListGastos.pagoImageContainer}
                      onPress={() =>
                        openImageModal(`${API_URL_BASE}/${archivo.filename}`)
                      }
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{
                          uri: `${API_URL_BASE}/${archivo.filename}`,
                        }}
                        style={stylesListGastos.pagoArchivoImage}
                        resizeMode="cover"
                      />
                      <View style={stylesListGastos.pagoImageOverlay}>
                        <Ionicons name="expand" size={14} color="white" />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={stylesListGastos.pagoDocumentContainer}
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
                        size={28}
                        color={MAIN_COLOR}
                      />

                      {/* Nombre del archivo */}
                      <Text
                        style={stylesListGastos.pagoDocumentText}
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

        {pago.numeroOperacion && (
          <View style={stylesListGastos.pagoOperacionContainer}>
            <Text style={stylesListGastos.pagoOperacionLabel}>Op:</Text>
            <Text style={stylesListGastos.pagoOperacionNumero}>
              {pago.numeroOperacion}
            </Text>
          </View>
        )}
      </View>

      {/* Modal para imagen en pantalla completa */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={isImageModalVisible}
        onRequestClose={closeImageModal}
      >
        <SafeAreaView style={stylesListGastos.imageModalContainer}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="black"
            translucent={false}
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
    </>
  );
};

export default PagoCard;
