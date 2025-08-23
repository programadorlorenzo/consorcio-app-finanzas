import {
    FileItem,
    formatFileSize,
    getAvailableSubcategorias,
    isImage,
    pickDocument,
    pickFromCamera,
    pickFromGallery,
} from "@/utils/pagos/create-pago-utils";
import { Ionicons } from "@expo/vector-icons";

import CustomSelectorCreatePago from "@/components/pagos/create-pagos/CustomSelectorCreatePago";
import { stylesBaseStylesCreatePago } from "@/styles/pagos/base-create-pago.styles";
import {
    CategoriaPago,
    MonedaPago,
    OrigenPago,
    PaymentFormData,
    TipoPago,
} from "@/types/pagos/pagos.types";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { MAIN_COLOR } from "./constants";

export default function CreateUpdatePago() {
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [formData, setFormData] = useState<PaymentFormData>({
    descripcion: "",
    categoria: null,
    subcategoria: null,
    tipo: null,
    origen: null,
    moneda: null,
    monto: "",
    fechaVencimiento: null,
    observaciones: "",
    ubicacionFisica: "",
    numeroRecibo: "",
  });

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showOrigenModal, setShowOrigenModal] = useState(false);
  const [showMonedaModal, setShowMonedaModal] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof PaymentFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategoría cuando cambia la categoría
      ...(field === "categoria" && { subcategoria: null }),
    }));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const showFileOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Cámara", "Galería", "Documentos"],
          cancelButtonIndex: 0,
        },
        (buttonIndex: number) => {
          switch (buttonIndex) {
            case 1:
              pickFromCamera(setFiles);
              break;
            case 2:
              pickFromGallery(setFiles);
              break;
            case 3:
              pickDocument(setFiles);
              break;
          }
        }
      );
    } else {
      setShowFileModal(true);
    }
  };

  const uploadFiles = async (pagoId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      try {
        const response = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.ok) {
          const result = await response.json();
          uploadedUrls.push(result.url);
        }
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (
      !formData.descripcion ||
      !formData.categoria ||
      !formData.tipo ||
      !formData.monto
    ) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const pagoData = {
        ...formData,
        monto: parseFloat(formData.monto),
        fechaVencimiento: formData.fechaVencimiento?.toISOString(),
      };

      const url = isEditing
        ? `http://localhost:3000/api/pagos/${params.id}`
        : "http://localhost:3000/api/pagos";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pagoData),
      });

      if (response.ok) {
        const result = await response.json();

        // Subir archivos si los hay
        if (files.length > 0) {
          await uploadFiles(result.id);
        }

        Alert.alert(
          "Éxito",
          `Pago ${isEditing ? "actualizado" : "creado"} correctamente`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Error al guardar el pago");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      Alert.alert("Error", "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Componente de selector personalizado

  return (
    <SafeAreaView style={stylesBaseStylesCreatePago.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={stylesBaseStylesCreatePago.header}>
        <TouchableOpacity
          style={stylesBaseStylesCreatePago.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
        <Text style={stylesBaseStylesCreatePago.headerTitle}>
          {isEditing ? "Editar Pago" : "Crear Pago"}
        </Text>
        <View style={stylesBaseStylesCreatePago.placeholder} />
      </View>

      <ScrollView
        style={stylesBaseStylesCreatePago.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={stylesBaseStylesCreatePago.form}>
          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>Categoría *</Text>
            <CustomSelectorCreatePago
              label="Seleccionar Categoría"
              value={formData.categoria}
              placeholder="Seleccionar categoría"
              options={Object.values(CategoriaPago)}
              onSelect={(value) => handleInputChange("categoria", value)}
              isVisible={showCategoriaModal}
              onClose={() => setShowCategoriaModal(!showCategoriaModal)}
            />
          </View>

          {formData.categoria &&
            getAvailableSubcategorias(formData).length > 0 && (
              <View style={stylesBaseStylesCreatePago.inputGroup}>
                <Text style={stylesBaseStylesCreatePago.label}>
                  Subcategoría
                </Text>
                <CustomSelectorCreatePago
                  label="Seleccionar Subcategoría"
                  value={formData.subcategoria}
                  placeholder="Seleccionar subcategoría"
                  options={getAvailableSubcategorias(formData)}
                  onSelect={(value) => handleInputChange("subcategoria", value)}
                  isVisible={showSubcategoriaModal}
                  onClose={() =>
                    setShowSubcategoriaModal(!showSubcategoriaModal)
                  }
                />
              </View>
            )}

          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>Tipo *</Text>
            <CustomSelectorCreatePago
              label="Seleccionar Tipo"
              value={formData.tipo}
              placeholder="Seleccionar tipo"
              options={Object.values(TipoPago)}
              onSelect={(value) => handleInputChange("tipo", value)}
              isVisible={showTipoModal}
              onClose={() => setShowTipoModal(!showTipoModal)}
            />
          </View>

          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>Origen</Text>
            <CustomSelectorCreatePago
              label="Seleccionar Origen"
              value={formData.origen}
              placeholder="Seleccionar origen"
              options={Object.values(OrigenPago)}
              onSelect={(value) => handleInputChange("origen", value)}
              isVisible={showOrigenModal}
              onClose={() => setShowOrigenModal(!showOrigenModal)}
            />
          </View>

          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>Moneda</Text>
            <CustomSelectorCreatePago
              label="Seleccionar Moneda"
              value={formData.moneda}
              placeholder="Seleccionar moneda"
              options={Object.values(MonedaPago)}
              onSelect={(value) => handleInputChange("moneda", value)}
              isVisible={showMonedaModal}
              onClose={() => setShowMonedaModal(!showMonedaModal)}
            />
          </View>

          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>Monto *</Text>
            <TextInput
              style={stylesBaseStylesCreatePago.input}
              value={formData.monto}
              onChangeText={(text) => handleInputChange("monto", text)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>
              Número de Recibo
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.input}
              value={formData.numeroRecibo}
              onChangeText={(text) => handleInputChange("numeroRecibo", text)}
              placeholder="Número de recibo (opcional)"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>
              Ubicación Física
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.input}
              value={formData.ubicacionFisica}
              onChangeText={(text) =>
                handleInputChange("ubicacionFisica", text)
              }
              placeholder="Ubicación del documento físico"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={stylesBaseStylesCreatePago.inputGroup}>
            <Text style={stylesBaseStylesCreatePago.label}>Observaciones</Text>
            <TextInput
              style={[
                stylesBaseStylesCreatePago.input,
                { height: 80, textAlignVertical: "top" },
              ]}
              value={formData.observaciones}
              onChangeText={(text) => handleInputChange("observaciones", text)}
              placeholder="Observaciones adicionales"
              multiline
              placeholderTextColor="#8A9A97"
            />
          </View>

          {/* Archivos */}
          <View style={stylesBaseStylesCreatePago.sectionHeader}>
            <Text style={stylesBaseStylesCreatePago.sectionTitle}>
              Archivos Adjuntos
            </Text>
          </View>

          <TouchableOpacity
            style={stylesBaseStylesCreatePago.addFileButton}
            onPress={showFileOptions}
          >
            <Ionicons name="add-circle-outline" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreatePago.addFileText}>
              Agregar Archivo
            </Text>
          </TouchableOpacity>

          {files.length > 0 && (
            <FlatList
              data={files}
              style={stylesBaseStylesCreatePago.filesList}
              renderItem={({ item, index }) => (
                <View style={stylesBaseStylesCreatePago.fileItem}>
                  {isImage(item.type) ? (
                    <Image
                      source={{ uri: item.uri }}
                      style={stylesBaseStylesCreatePago.fileImage}
                    />
                  ) : (
                    <View style={stylesBaseStylesCreatePago.fileIcon}>
                      <Ionicons
                        name="document-outline"
                        size={24}
                        color={MAIN_COLOR}
                      />
                    </View>
                  )}
                  <View style={stylesBaseStylesCreatePago.fileInfo}>
                    <Text
                      style={stylesBaseStylesCreatePago.fileName}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text style={stylesBaseStylesCreatePago.fileSize}>
                      {formatFileSize(item.size)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={stylesBaseStylesCreatePago.removeFileButton}
                    onPress={() => removeFile(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => `${item.uri}_${index}`}
              scrollEnabled={false}
            />
          )}

          <TouchableOpacity
            style={[
              stylesBaseStylesCreatePago.submitButton,
              loading && stylesBaseStylesCreatePago.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={stylesBaseStylesCreatePago.buttonText}>
                {isEditing ? "Actualizar Pago" : "Crear Pago"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para opciones de archivo (Android) */}
      <Modal
        visible={showFileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFileModal(false)}
      >
        <TouchableOpacity
          style={stylesBaseStylesCreatePago.modalOverlay}
          onPress={() => setShowFileModal(false)}
        >
          <View style={stylesBaseStylesCreatePago.modalContent}>
            <Text style={stylesBaseStylesCreatePago.modalTitle}>
              Seleccionar Archivo
            </Text>

            <TouchableOpacity
              style={stylesBaseStylesCreatePago.modalOption}
              onPress={() => {
                setShowFileModal(false);
                pickFromCamera(setFiles);
              }}
            >
              <Ionicons name="camera" size={24} color={MAIN_COLOR} />
              <Text style={stylesBaseStylesCreatePago.modalOptionText}>
                Cámara
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesBaseStylesCreatePago.modalOption}
              onPress={() => {
                setShowFileModal(false);
                pickFromGallery(setFiles);
              }}
            >
              <Ionicons name="image" size={24} color={MAIN_COLOR} />
              <Text style={stylesBaseStylesCreatePago.modalOptionText}>
                Galería
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesBaseStylesCreatePago.modalOption}
              onPress={() => {
                setShowFileModal(false);
                pickDocument(setFiles);
              }}
            >
              <Ionicons name="document" size={24} color={MAIN_COLOR} />
              <Text style={stylesBaseStylesCreatePago.modalOptionText}>
                Documentos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                stylesBaseStylesCreatePago.modalOption,
                stylesBaseStylesCreatePago.cancelOption,
              ]}
              onPress={() => setShowFileModal(false)}
            >
              <Text style={stylesBaseStylesCreatePago.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
