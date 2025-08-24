import ListArchivosCreateGasto from "@/components/gastos/create-update-pagos/ArchivosCreateUpdateGasto";
import CustomSelectorCreateGasto from "@/components/gastos/create-update-pagos/CustomSelectorCreateUpdateGasto";
import ModalOpcionesArchivoCreateUpdateGasto from "@/components/gastos/create-update-pagos/ModalOpcionesArchivoCreateUpdateGasto";
import { stylesBaseStylesCreateGasto } from "@/styles/gastos/base-create-update-gasto.styles";
import { CategoriaGasto, GastoFormData } from "@/types/gastos/gastos.types";
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

  const [formData, setFormData] = useState<GastoFormData>({
    descripcion: "",
    categoria: null,
    subcategoria: null,
    monto: "",
    fechaVencimiento: null,
    observaciones: "",
    ubicacionFisica: "",
    numeroRecibo: "",
    cuentaBancaria: "",
  });
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof GastoFormData, value: any) => {
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

  const uploadFiles = async (): Promise<string[]> => {
    return [];
  };

  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);
  };

  // Componente de selector personalizado
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
          {isEditing ? "Editar Pago" : "Crear Pago"}
        </Text>
        <View style={stylesBaseStylesCreateGasto.placeholder} />
      </View>
      <ScrollView
        style={stylesBaseStylesCreateGasto.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={stylesBaseStylesCreateGasto.form}>
          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Categoría *</Text>
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

          {/* <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <CustomSwitch
              label="Origen"
              value={formData.origen === OrigenPago.EXTERNO}
              onValueChange={(value) =>
                handleInputChange(
                  "origen",
                  value ? OrigenPago.EXTERNO : OrigenPago.CUENTA_EMPRESA
                )
              }
              leftLabel="Cuenta Empresa"
              rightLabel="Externo"
            />
          </View> */}

          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>
              Cuenta Bancaria
            </Text>
            <TextInput
              style={stylesBaseStylesCreateGasto.input}
              value={formData.cuentaBancaria}
              onChangeText={(text) => handleInputChange("cuentaBancaria", text)}
              placeholder="Número de cuenta"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Monto *</Text>
            <TextInput
              style={stylesBaseStylesCreateGasto.input}
              value={formData.monto}
              onChangeText={(text) => handleInputChange("monto", text)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={stylesBaseStylesCreateGasto.inputGroup}>
            <Text style={stylesBaseStylesCreateGasto.label}>Comprobante</Text>
            <TextInput
              style={stylesBaseStylesCreateGasto.input}
              value={formData.numeroRecibo}
              onChangeText={(text) => handleInputChange("numeroRecibo", text)}
              placeholder="Comprobante (opcional)"
              placeholderTextColor="#8A9A97"
            />
          </View>

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
                {isEditing ? "Actualizar Pago" : "Crear Pago"}
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
