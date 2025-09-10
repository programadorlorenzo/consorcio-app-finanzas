import { API_URL_BASE } from '@/app/backend';
import { MAIN_COLOR } from '@/app/constants';
import { DetalleRendicion } from '@/types/rendiciones/rendiciones.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DetalleCardProps {
  detalle: DetalleRendicion;
  index: number;
}

export default function DetalleCard({ detalle, index }: DetalleCardProps) {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  // Helper function para convertir valores a número y formatear
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  // Formatear fecha
  const formatFecha = (fechaString: string): string => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fechaString;
    }
  };

  // Función para verificar si un archivo es imagen
  const isImageFile = (filename: string): boolean => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => filename.toLowerCase().includes(ext));
  };

  // Función para obtener el icono del archivo
  const getFileIcon = (filename: string): any => {
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf':
        return 'document-text';
      case 'doc':
      case 'docx':
        return 'document';
      case 'xls':
      case 'xlsx':
        return 'grid';
      case 'txt':
        return 'document-text-outline';
      default:
        return 'document-attach';
    }
  };

  // Función para truncar nombre de archivo
  const truncateFileName = (filename: string, maxLength: number = 15): string => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - (extension?.length || 0));
    return `${truncatedName}...${extension}`;
  };

  // Función para abrir modal de imagen
  const openImageModal = (uri: string) => {
    setSelectedImageUri(uri);
    setIsImageModalVisible(true);
  };

  // Función para descargar archivo
  const downloadFile = async (url: string, filename: string) => {
    try {
      Alert.alert(
        'Descargar archivo',
        `¿Deseas descargar ${filename}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Descargar', 
            onPress: () => {
              // Aquí podrías implementar la lógica de descarga
              Alert.alert('Descarga', 'Funcionalidad de descarga pendiente de implementar');
            }
          }
        ]
      );
    } catch {
      Alert.alert('Error', 'No se pudo descargar el archivo');
    }
  };

  return (
    <View style={styles.detalleCard}>
      {/* Header del detalle */}
      <View style={styles.detalleHeader}>
        <View style={styles.detalleNumberContainer}>
          <Text style={styles.detalleNumber}>#{index + 1}</Text>
        </View>
        <View style={styles.detalleMainInfo}>
          <Text style={styles.detalleDescripcion} numberOfLines={2}>
            {detalle.descripcion}
          </Text>
          <View style={styles.detalleFechaContainer}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.detalleFecha}>
              {formatFecha(detalle.fecha)}
            </Text>
          </View>
        </View>
        <View style={styles.detalleImporteContainer}>
          <Text style={styles.detalleImporte}>
            S/ {formatCurrency(detalle.importeTotal)}
          </Text>
          {detalle.cantidad && detalle.cantidad !== 1 && (
            <Text style={styles.detalleUnidades}>
              {detalle.cantidad} {detalle.cantidad === 1 ? 'unidad' : 'unidades'}
            </Text>
          )}
        </View>
      </View>

      {/* Información bancaria */}
      {(detalle.banco || detalle.cuentabancaria || detalle.cci || detalle.titular) && (
        <View style={styles.detalleBankInfo}>
          <View style={styles.bankHeader}>
            <Ionicons name="card-outline" size={16} color="#10B981" />
            <Text style={styles.bankTitle}>Destino de Pago</Text>
          </View>
          <View style={styles.bankGrid}>
            {detalle.banco && (
              <View style={styles.bankItem}>
                <Text style={styles.bankLabel}>Banco:</Text>
                <Text style={styles.bankValue}>{detalle.banco}</Text>
              </View>
            )}
            {detalle.titular && (
              <View style={styles.bankItem}>
                <Text style={styles.bankLabel}>Titular:</Text>
                <Text style={styles.bankValue}>{detalle.titular}</Text>
              </View>
            )}
            {detalle.cuentabancaria && (
              <View style={styles.bankItem}>
                <Text style={styles.bankLabel}>Cuenta:</Text>
                <Text style={styles.bankValue}>{detalle.cuentabancaria}</Text>
              </View>
            )}
            {detalle.cci && (
              <View style={styles.bankItem}>
                <Text style={styles.bankLabel}>CCI:</Text>
                <Text style={styles.bankValue}>{detalle.cci}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Observaciones */}
      {detalle.observaciones && (
        <View style={styles.detalleObservacionesContainer}>
          <Text style={styles.detalleObservaciones}>
            &ldquo;{detalle.observaciones}&rdquo;
          </Text>
        </View>
      )}

      {/* Archivos adjuntos */}
      {detalle.archivos && detalle.archivos.length > 0 && (
        <View style={styles.detalleArchivosContainer}>
          <View style={styles.archivosHeader}>
            <Ionicons name="attach-outline" size={16} color="#6B7280" />
            <Text style={styles.archivosText}>
              Archivos ({detalle.archivos.length}):
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.archivosScroll}
          >
            {detalle.archivos.map((archivo, index) => (
              <View key={index} style={styles.archivoItem}>
                {isImageFile(archivo.filename || "") ? (
                  <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() =>
                      openImageModal(`${API_URL_BASE}/${archivo.filename}`)
                    }
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{
                        uri: `${API_URL_BASE}/${archivo.filename}`,
                      }}
                      style={styles.archivoImage}
                      contentFit="cover"
                      placeholder="📷"
                      transition={150}
                      cachePolicy="memory-disk"
                    />
                    <View style={styles.imageOverlay}>
                      <Ionicons name="expand" size={14} color="white" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.documentContainer}
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
                      style={styles.documentText}
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

      {/* Modal para visualizar imágenes con zoom */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <SafeAreaView style={styles.imageModalContainer}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="rgba(0,0,0,0.9)"
          />

          {/* Header del modal */}
          <View style={styles.imageModalHeader}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Imagen con zoom */}
          <ScrollView
            style={styles.imageZoomScrollView}
            contentContainerStyle={styles.imageZoomContainer}
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
                style={styles.fullScreenImage}
                contentFit="contain"
                placeholder="Loading image..."
                transition={200}
                cachePolicy="memory-disk"
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  detalleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: MAIN_COLOR,
  },
  detalleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detalleNumberContainer: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detalleNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  detalleMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  detalleDescripcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 20,
  },
  detalleFechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detalleFecha: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  detalleImporteContainer: {
    alignItems: 'flex-end',
  },
  detalleImporte: {
    fontSize: 18,
    fontWeight: '700',
    color: MAIN_COLOR,
    marginBottom: 2,
  },
  detalleUnidades: {
    fontSize: 12,
    color: '#6B7280',
  },
  detalleBankInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 6,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankItem: {
    width: '48%',
    marginBottom: 4,
  },
  bankLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  bankValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    marginTop: 1,
  },
  detalleObservacionesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
  },
  detalleObservaciones: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#4B5563',
    lineHeight: 18,
  },
  detalleArchivosContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  archivosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  archivosText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  archivosScroll: {
    flexDirection: 'row',
  },
  archivoItem: {
    marginRight: 8,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  archivoImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  // Nuevos estilos para zoom
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeModalButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageZoomScrollView: {
    flex: 1,
  },
  imageZoomContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    maxWidth: 400,
    maxHeight: 600,
  },
});
