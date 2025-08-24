import { MAIN_COLOR } from "@/app/constants";
import { stylesBaseStylesCreateGasto } from "@/styles/gastos/base-create-update-gasto.styles";
import {
  FileItem,
  formatFileSize,
  isImage,
} from "@/utils/gastos/create-gasto-utils";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ListArchivosCreateGastoProps {
  files: FileItem[];
  removeFile: (index: number) => void;
}

const ListArchivosCreateGasto = ({
  files,
  removeFile,
}: ListArchivosCreateGastoProps) => {
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
          onPress: () => removeFile(index),
        },
      ]
    );
  };

  // Función para truncar nombre de archivo
  const truncateFileName = (fileName: string, maxLength: number = 12) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split(".").pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(0, maxLength - 4);
    return `${truncatedName}... .${extension}`;
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageUri(null);
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <>
      {/* Grid Horizontal de Archivos */}
      <View style={stylesBaseStylesCreateGasto.filesContainer}>
        <ScrollView
          horizontal={true}
          style={stylesBaseStylesCreateGasto.filesScrollView}
          contentContainerStyle={stylesBaseStylesCreateGasto.filesScrollContent}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          bounces={true}
        >
          {files.map((item, index) => (
            <View
              key={`${item.uri}_${index}`}
              style={stylesBaseStylesCreateGasto.fileGridItem}
            >
              {/* Botón eliminar en esquina superior derecha */}
              <TouchableOpacity
                style={stylesBaseStylesCreateGasto.removeFileButtonGrid}
                onPress={() => handleRemoveFile(index)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </TouchableOpacity>

              {/* Preview del archivo */}
              <TouchableOpacity
                style={stylesBaseStylesCreateGasto.filePreviewGrid}
                onPress={() => {
                  console.log("File clicked:", {
                    name: item.name,
                    type: item.type,
                    isImage: isImage(item.type),
                  });
                  return isImage(item.type) ? handleImagePress(item.uri) : null;
                }}
                disabled={!isImage(item.type)}
                activeOpacity={isImage(item.type) ? 0.7 : 1}
              >
                {isImage(item.type) ? (
                  <View style={stylesBaseStylesCreateGasto.imagePreviewGrid}>
                    <Image
                      source={{ uri: item.uri }}
                      style={stylesBaseStylesCreateGasto.gridImagePreview}
                      resizeMode="cover"
                      onError={(error) =>
                        console.log("Image load error:", error)
                      }
                      onLoad={() =>
                        console.log("Image loaded successfully:", item.name)
                      }
                    />
                  </View>
                ) : (
                  <View style={stylesBaseStylesCreateGasto.fileIconGrid}>
                    <Ionicons
                      name={getFileIcon(item.type)}
                      size={28}
                      color={MAIN_COLOR}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* Información del archivo - solo para no imágenes */}
              {!isImage(item.type) && (
                <View style={stylesBaseStylesCreateGasto.fileInfoGrid}>
                  <Text
                    style={stylesBaseStylesCreateGasto.fileNameGrid}
                    numberOfLines={2}
                  >
                    {truncateFileName(item.name, 10)}
                  </Text>
                  <Text style={stylesBaseStylesCreateGasto.fileSizeGrid}>
                    {formatFileSize(item.size)}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modal para vista previa de imagen con zoom */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <SafeAreaView style={stylesBaseStylesCreateGasto.imageModalContainer}>
          <StatusBar style="light" />

          {/* Header del modal - solo botón cerrar */}
          <View style={stylesBaseStylesCreateGasto.imageModalHeader}>
            <TouchableOpacity
              style={stylesBaseStylesCreateGasto.closeModalButton}
              onPress={closeImageModal}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Imagen con zoom */}
          <ScrollView
            style={stylesBaseStylesCreateGasto.imageZoomScrollView}
            contentContainerStyle={
              stylesBaseStylesCreateGasto.imageZoomContainer
            }
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
                style={stylesBaseStylesCreateGasto.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </ScrollView>

          {/* Footer con instrucciones */}
          <View style={stylesBaseStylesCreateGasto.imageModalFooter}>
            <Text style={stylesBaseStylesCreateGasto.zoomInstructions}>
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

export default ListArchivosCreateGasto;
