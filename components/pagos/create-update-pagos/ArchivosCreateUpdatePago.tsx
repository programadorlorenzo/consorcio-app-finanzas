import { MAIN_COLOR } from "@/app/constants";
import { stylesArchivosCreatePago } from "@/styles/pagos/archivos-create-pago.styles";
import {
  FileItem,
  formatFileSize,
  isImage,
} from "@/utils/gastos/create-gasto-utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ArchivosCreateUpdatePagoProps {
  files: FileItem[];
  onAddFile: () => void;
  onRemoveFile: (index: number) => void;
  disabled?: boolean;
}

const ArchivosCreateUpdatePago: React.FC<ArchivosCreateUpdatePagoProps> = ({
  files,
  onAddFile,
  onRemoveFile,
  disabled = false,
}) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const handleImagePress = (uri: string) => {
    setSelectedImageUri(uri);
    setIsImageModalVisible(true);
  };

  const handleRemoveFile = (index: number) => {
    Alert.alert(
      "Eliminar archivo",
      "¿Estás seguro de que deseas eliminar este archivo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onRemoveFile(index),
        },
      ]
    );
  };

  return (
    <>
      <View style={stylesArchivosCreatePago.container}>
        {/* Botón para agregar archivos */}
        <TouchableOpacity
          style={[
            stylesArchivosCreatePago.addButton,
            disabled && stylesArchivosCreatePago.addButtonDisabled
          ]}
          onPress={disabled ? undefined : onAddFile}
          activeOpacity={disabled ? 1 : 0.7}
          disabled={disabled}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={24} 
            color={disabled ? "#ccc" : MAIN_COLOR} 
          />
          <Text style={[
            stylesArchivosCreatePago.addButtonText,
            disabled && stylesArchivosCreatePago.addButtonTextDisabled
          ]}>
            {disabled ? "Seleccionando archivo..." : "Agregar voucher u otros archivos"}
          </Text>
        </TouchableOpacity>

        {/* Lista de archivos */}
        {files.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={stylesArchivosCreatePago.filesContainer}
          >
            {files.map((file, index) => (
              <View key={index} style={stylesArchivosCreatePago.fileItem}>
                {/* Vista previa del archivo */}
                <TouchableOpacity
                  style={stylesArchivosCreatePago.filePreview}
                  onPress={() => {
                    if (isImage(file.name)) {
                      handleImagePress(file.uri);
                    }
                  }}
                  activeOpacity={isImage(file.name) ? 0.7 : 1}
                >
                  {isImage(file.name) ? (
                    <Image
                      source={{ uri: file.uri }}
                      style={stylesArchivosCreatePago.fileImage}
                      contentFit="cover"
                      placeholder="📷"
                      transition={150}
                      cachePolicy="memory-disk"
                    />
                  ) : (
                    <View style={stylesArchivosCreatePago.fileIconContainer}>
                      <Ionicons
                        name={getFileIcon(file.type || '')}
                        size={32}
                        color={MAIN_COLOR}
                      />
                    </View>
                  )}

                  {/* Botón para eliminar */}
                  <TouchableOpacity
                    style={stylesArchivosCreatePago.removeButton}
                    onPress={() => handleRemoveFile(index)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </TouchableOpacity>

                {/* Información del archivo */}
                <View style={stylesArchivosCreatePago.fileInfo}>
                  <Text
                    style={stylesArchivosCreatePago.fileName}
                    numberOfLines={2}
                  >
                    {file.name}
                  </Text>
                  <Text style={stylesArchivosCreatePago.fileSize}>
                    {formatFileSize(file.size || 0)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Mensaje cuando no hay archivos */}
        {files.length === 0 && (
          <View style={stylesArchivosCreatePago.emptyContainer}>
            <Ionicons name="document-outline" size={48} color="#9CA3AF" />
            <Text style={stylesArchivosCreatePago.emptyText}>
              No hay archivos adjuntos
            </Text>
            <Text style={stylesArchivosCreatePago.emptySubText}>
              Agrega vouchers de pago y otros documentos
            </Text>
          </View>
        )}
      </View>

      {/* Modal para vista previa de imágenes */}
      <Modal
        visible={isImageModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <StatusBar style="light" backgroundColor="#000000" />
        <SafeAreaView style={stylesArchivosCreatePago.imageModalContainer}>
          {/* Header del modal */}
          <View style={stylesArchivosCreatePago.imageModalHeader}>
            <TouchableOpacity
              style={stylesArchivosCreatePago.imageModalCloseButton}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Imagen con zoom */}
          <ScrollView
            style={stylesArchivosCreatePago.imageZoomScrollView}
            contentContainerStyle={stylesArchivosCreatePago.imageZoomContainer}
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
                style={stylesArchivosCreatePago.fullScreenImage}
                contentFit="contain"
                placeholder="Loading image..."
                transition={200}
                cachePolicy="memory-disk"
              />
            )}
          </ScrollView>

          {/* Footer con instrucciones */}
          <View style={stylesArchivosCreatePago.imageModalFooter}>
            <Text style={stylesArchivosCreatePago.zoomInstructions}>
              Pellizca para hacer zoom • Desliza para mover
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

// Función auxiliar para obtener el ícono según el tipo de archivo
const getFileIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  if (type.includes("pdf")) return "document-text-outline";
  if (type.includes("word") || type.includes("doc")) return "document-outline";
  if (type.includes("excel") || type.includes("sheet")) return "grid-outline";
  if (type.includes("powerpoint") || type.includes("presentation"))
    return "easel-outline";
  if (type.includes("zip") || type.includes("rar")) return "archive-outline";
  return "document-outline";
};

export default ArchivosCreateUpdatePago;
