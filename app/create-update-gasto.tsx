import ListArchivosCreateGasto from "@/components/gastos/create-update-pagos/ArchivosCreateUpdateGasto";
import CustomSelectorCreateGasto from "@/components/gastos/create-update-pagos/CustomSelectorCreateUpdateGasto";
import EtiquetasSelectorCreateUpdateGasto from "@/components/gastos/create-update-pagos/EtiquetasSelectorCreateUpdateGasto";
import ModalOpcionesArchivoCreateUpdateGasto from "@/components/gastos/create-update-pagos/ModalOpcionesArchivoCreateUpdateGasto";
import { stylesBaseStylesCreateGasto } from "@/styles/gastos/base-create-update-gasto.styles";
import {
  CategoriaGasto,
  EstadoGasto,
  GastoCreateDto,
  Moneda,
} from "@/types/gastos/gastos.types";
import {
  FileItem,
  getAvailableSubcategorias,
  pickDocument,
  pickFromCamera,
  pickFromGallery,
} from "@/utils/gastos/create-gasto-utils";
import { formatDisplayText } from "@/utils/gastos/custom_selector_create_update_gasto.utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MAIN_COLOR } from "./constants";

export default function CreateUpdateGasto() {
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [formData, setFormData] = useState<GastoCreateDto>({
    // Campos requeridos
    importe: 0, // Se manejará como string en el input

    // Campos opcionales con valores iniciales
    estado: EstadoGasto.PENDIENTE,
    descripcion: "",
    observaciones: "",
    categoria: undefined,
    subcategoria: undefined,
    moneda: Moneda.SOLES,
    rutasArchivos: [],
    etiquetasIds: [],
  });

  // Estado separado para el importe como string para manejar decimales
  const [importeText, setImporteText] = useState<string>("");

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
  const [showMonedaModal, setShowMonedaModal] = useState(false);
  const [showEtiquetasModal, setShowEtiquetasModal] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof GastoCreateDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategoría cuando cambia la categoría
      ...(field === "categoria" && { subcategoria: undefined }),
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

  const uploadFiles = async (): Promise<string[]> => {
    return [];
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!formData.importe || formData.importe <= 0) {
      alert("El importe es requerido y debe ser mayor a 0");
      return;
    }

    if (!formData.descripcion || formData.descripcion.trim() === "") {
      alert("La descripción es requerida");
      return;
    }

    console.log("Submitting gasto data:", formData);
  };

  return (
    <SafeAreaView style={stylesBaseStylesCreateGasto.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={stylesBaseStylesCreateGasto.header}>
        <TouchableOpacity
          style={stylesBaseStylesCreateGasto.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
        <Text style={stylesBaseStylesCreateGasto.headerTitle}>
          {isEditing ? "Editar Gasto" : "Crear Gasto"}
        </Text>
        <View style={stylesBaseStylesCreateGasto.placeholder} />
      </View>

      <ScrollView
        style={stylesBaseStylesCreateGasto.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={stylesBaseStylesCreateGasto.form}>
          {/* Descripción */}
          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Descripción *</Text>
            <TextInput
              style={stylesBaseStylesCreateGasto.input}
              value={formData.descripcion}
              onChangeText={(text) => handleInputChange("descripcion", text)}
              placeholder="Descripción del gasto"
              placeholderTextColor="#8A9A97"
            />
          </View>

          {/* Categoría */}
          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Categoría</Text>
            <CustomSelectorCreateGasto
              label="Seleccionar Categoría"
              value={formData.categoria}
              placeholder="Seleccionar categoría"
              options={Object.values(CategoriaGasto)}
              onSelect={(value) => handleInputChange("categoria", value)}
              isVisible={showCategoriaModal}
              onClose={() => setShowCategoriaModal(!showCategoriaModal)}
            />
          </View>

          {/* Subcategoría */}
          {formData.categoria &&
            getAvailableSubcategorias(formData).length > 0 && (
              <View style={stylesBaseStylesCreateGasto.inputGroup}>
                <Text style={stylesBaseStylesCreateGasto.label}>
                  Subcategoría de {formatDisplayText(formData.categoria)}
                </Text>
                <CustomSelectorCreateGasto
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

          {/* Importe */}
          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Importe *</Text>
            <TextInput
              style={stylesBaseStylesCreateGasto.input}
              value={importeText}
              onChangeText={(text) => {
                // Permitir números decimales (reemplazar comas con puntos)
                const sanitizedText = text.replace(/,/g, ".");
                // Solo permitir formatos numéricos válidos (dígitos y máximo un punto decimal)
                if (sanitizedText === "" || /^\d*\.?\d*$/.test(sanitizedText)) {
                  setImporteText(sanitizedText);
                  // Actualizar el valor numérico en formData
                  const numericValue =
                    sanitizedText === "" ? 0 : parseFloat(sanitizedText) || 0;
                  handleInputChange("importe", numericValue);
                }
              }}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#8A9A97"
            />
          </View>

          {/* Moneda */}
          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Moneda</Text>
            <CustomSelectorCreateGasto
              label="Seleccionar Moneda"
              value={formData.moneda}
              placeholder="Seleccionar moneda"
              options={Object.values(Moneda)}
              onSelect={(value) => handleInputChange("moneda", value)}
              isVisible={showMonedaModal}
              onClose={() => setShowMonedaModal(!showMonedaModal)}
            />
          </View>

          {/* Observaciones */}
          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Observaciones</Text>
            <TextInput
              style={[
                stylesBaseStylesCreateGasto.input,
                { height: 80, textAlignVertical: "top" },
              ]}
              value={formData.observaciones}
              onChangeText={(text) => handleInputChange("observaciones", text)}
              placeholder="Observaciones adicionales"
              multiline
              placeholderTextColor="#8A9A97"
            />
          </View>

          {/* Etiquetas */}
          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Etiquetas</Text>
            <EtiquetasSelectorCreateUpdateGasto
              selectedEtiquetasIds={formData.etiquetasIds || []}
              onEtiquetasChange={(etiquetasIds) =>
                handleInputChange("etiquetasIds", etiquetasIds)
              }
              isVisible={showEtiquetasModal}
              onClose={() => setShowEtiquetasModal(!showEtiquetasModal)}
            />
          </View>

          {/* Archivos */}
          <View style={stylesBaseStylesCreateGasto.sectionHeader}>
            <Text style={stylesBaseStylesCreateGasto.sectionTitle}>
              Archivos Adjuntos
            </Text>
          </View>

          <TouchableOpacity
            style={stylesBaseStylesCreateGasto.addFileButton}
            onPress={showFileOptions}
          >
            <Ionicons name="add-circle-outline" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreateGasto.addFileText}>
              Agregar Archivo
            </Text>
          </TouchableOpacity>

          {files.length > 0 && (
            <ListArchivosCreateGasto files={files} removeFile={removeFile} />
          )}

          {/* Botón Submit */}
          <TouchableOpacity
            style={[
              stylesBaseStylesCreateGasto.submitButton,
              loading && stylesBaseStylesCreateGasto.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={stylesBaseStylesCreateGasto.buttonText}>
                {isEditing ? "Actualizar Gasto" : "Crear Gasto"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para opciones de archivo (Android) */}
      <ModalOpcionesArchivoCreateUpdateGasto
        showFileModal={showFileModal}
        setShowFileModal={setShowFileModal}
        setFiles={setFiles}
      />
    </SafeAreaView>
  );
}
