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
            {/* Código del pago */}
            <View style={stylesListGastos.pagoCodigoContainer}>
              <Text style={stylesListGastos.pagoCodigoText}>#P{pago.id}</Text>
            </View>

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
            {getMonedaSymbol(pago.moneda)} {formatImporte(pago.importe)}
          </Text>
        </View>

        {/* Información adicional del pago */}
        <View style={stylesListGastos.pagoDetallesContainer}>
          {/* Número de operación */}
          {pago.numeroOperacion && (
            <View style={stylesListGastos.pagoDetalleItem}>
              <Ionicons name="receipt-outline" size={12} color="#6B7280" />
              <Text style={stylesListGastos.pagoDetalleLabel}>Op:</Text>
              <Text style={stylesListGastos.pagoDetalleValue}>
                {pago.numeroOperacion}
              </Text>
            </View>
          )}

          {/* Origen */}
          {(pago.titular_origen || pago.banco_origen) && (
            <View style={stylesListGastos.pagoDetalleItem}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={12}
                color="#6B7280"
              />
              <Text style={stylesListGastos.pagoDetalleLabel}>De:</Text>
              <Text style={stylesListGastos.pagoDetalleValue}>
                {pago.titular_origen || "Sin titular"}{" "}
                {pago.banco_origen && `(${pago.banco_origen})`}
              </Text>
            </View>
          )}

          {/* Destino */}
          {(pago.titular_destino || pago.banco_destino) && (
            <View style={stylesListGastos.pagoDetalleItem}>
              <Ionicons
                name="arrow-down-circle-outline"
                size={12}
                color="#6B7280"
              />
              <Text style={stylesListGastos.pagoDetalleLabel}>A:</Text>
              <Text style={stylesListGastos.pagoDetalleValue}>
                {pago.titular_destino || "Sin titular"}{" "}
                {pago.banco_destino && `(${pago.banco_destino})`}
              </Text>
            </View>
          )}
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

        {/* Usuario y Fecha del Pago */}
        {(pago.usuarioRegistroPagoNombre || pago.fechaRegistro) && (
          <View style={stylesListGastos.pagoFooterContainer}>
            {pago.usuarioRegistroPagoNombre && (
              <View style={stylesListGastos.pagoUsuarioContainer}>
                <Ionicons name="person-circle" size={16} color="#8A9A97" />
                <Text style={stylesListGastos.pagoCreadorLabel}>
                  Creado por {pago.usuarioRegistroPagoNombre}
                </Text>
              </View>
            )}
            {pago.fechaRegistro && (
              <View style={stylesListGastos.pagoFechaContainer}>
                <Ionicons name="time" size={14} color="#94A3B8" />
                <Text style={stylesListGastos.pagoRegistradoLabel}>
                  Registrado el{" "}
                  {new Date(pago.fechaRegistro).toLocaleDateString("es-ES")}{" "}
                  {new Date(pago.fechaRegistro).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
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
