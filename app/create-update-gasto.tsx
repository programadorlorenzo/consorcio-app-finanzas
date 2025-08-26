import { uploadMultipleFiles } from "@/api/files/files-api";
import { createGasto } from "@/api/gastos/gastos-api";
import ListArchivosCreateGasto from "@/components/gastos/create-update-pagos/ArchivosCreateUpdateGasto";
import CustomSelectorCreateGasto from "@/components/gastos/create-update-pagos/CustomSelectorCreateUpdateGasto";
import EtiquetasSelectorCreateUpdateGasto from "@/components/gastos/create-update-pagos/EtiquetasSelectorCreateUpdateGasto";
import ModalOpcionesArchivoCreateUpdateGasto from "@/components/gastos/create-update-pagos/ModalOpcionesArchivoCreateUpdateGasto";
import BancoSelector from "@/components/pagos/create-update-pagos/BancoSelector";
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
import React, { useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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
  const scrollViewRef = useRef<ScrollView>(null);

  const [formData, setFormData] = useState<GastoCreateDto>({
    // Campos requeridos
    importe: 0, // Se manejará como string en el input
    // Campos opcionales con valores iniciales
    estado: EstadoGasto.PENDIENTE,
    descripcion: "",
    observaciones: "",
    categoria: undefined,
    subcategoria: undefined,
    moneda: undefined,
    // Campos del proveedor
    proveedor: "",
    proveedor_banco: "",
    proveedor_cuenta: "",
    proveedor_cci: "",
    rutasArchivos: [],
    etiquetasIds: [],
  });

  // Estado separado para el importe como string para manejar decimales
  const [importeText, setImporteText] = useState<string>("");

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
  const [showMonedaModal, setShowMonedaModal] = useState(false);
  const [showProveedorSection, setShowProveedorSection] = useState(false);
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
    try {
      if (files.length === 0) {
        return [];
      }

      console.log("🚀 Subiendo archivos:", files.length);

      // Preparar archivos para upload
      const filesToUpload = files.map((fileItem) => ({
        uri: fileItem.uri,
        fileName: fileItem.name,
        type: fileItem.type,
      }));

      // Subir archivos usando la API
      const uploadedFilePaths = await uploadMultipleFiles(filesToUpload);

      console.log("✅ Archivos subidos exitosamente:", uploadedFilePaths);
      return uploadedFilePaths;
    } catch (error) {
      console.error("❌ Error subiendo archivos:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      // Validación básica
      if (!formData.importe || formData.importe <= 0) {
        alert("El importe es requerido y debe ser mayor a 0");
        return;
      }

      if (!formData.descripcion || formData.descripcion.trim() === "") {
        alert("La descripción es requerida");
        return;
      }

      setLoading(true);
      console.log("🚀 Iniciando creación de gasto:", formData);

      // 1. Subir archivos primero
      const uploadedFilePaths = await uploadFiles();
      console.log("📁 Archivos subidos:", uploadedFilePaths);

      // 2. Crear el gasto con las rutas de los archivos
      const gastoData: GastoCreateDto = {
        ...formData,
        rutasArchivos: uploadedFilePaths, // Agregar las rutas de archivos subidos
      };

      const createdGasto = await createGasto(gastoData);
      console.log("✅ Gasto creado exitosamente:", createdGasto);

      // Limpiar formulario y archivos
      setFormData({
        categoria: undefined,
        subcategoria: undefined,
        descripcion: "",
        importe: 0,
        moneda: undefined,
        observaciones: "",
        etiquetasIds: [],
        rutasArchivos: [],
        estado: EstadoGasto.PENDIENTE,
      });
      setFiles([]);
      setImporteText("");

      // Mostrar alert con opciones
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: "¡Gasto registrado exitosamente!",
            message: "¿Qué deseas hacer ahora?",
            options: ["Registrar Pago", "Ver los gastos"],
          },
          (buttonIndex: number) => {
            switch (buttonIndex) {
              case 0:
                // Registrar pago
                router.push({
                  pathname: "/create-update-pago",
                  params: { gastoId: createdGasto.id },
                });
                break;
              case 1:
                // Ver los gastos
                router.push("/list-gastos");
                break;
            }
          }
        );
      } else {
        // Para Android, usar Alert nativo con botones
        Alert.alert(
          "¡Gasto registrado exitosamente!",
          "¿Qué deseas hacer ahora?",
          [
            {
              text: "Finalizar",
              onPress: () => router.push("/list-gastos"),
              style: "cancel",
            },
            {
              text: "Registrar Pago",
              onPress: () =>
                router.push({
                  pathname: "/create-update-pago",
                  params: { gastoId: createdGasto.id },
                }),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("❌ Error creando gasto:", error);
      alert("Error al crear el gasto. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled={true}
      >
        <ScrollView
          ref={scrollViewRef}
          style={stylesBaseStylesCreateGasto.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={stylesBaseStylesCreateGasto.form}>
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
                    onSelect={(value) =>
                      handleInputChange("subcategoria", value)
                    }
                    isVisible={showSubcategoriaModal}
                    onClose={() =>
                      setShowSubcategoriaModal(!showSubcategoriaModal)
                    }
                  />
                </View>
              )}

            {/* Descripción */}
            <View style={stylesBaseStylesCreateGasto.inputGroup}>
              <Text style={stylesBaseStylesCreateGasto.label}>
                Descripción *
              </Text>
              <TextInput
                style={stylesBaseStylesCreateGasto.input}
                value={formData.descripcion}
                onChangeText={(text) =>
                  handleInputChange("descripcion", text.toUpperCase())
                }
                placeholder="Descripción del gasto"
                placeholderTextColor="#8A9A97"
                autoCapitalize="characters"
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
                isVisible={false}
                onClose={() => {}}
              />
            </View>

            {/* Importe y Moneda en la misma línea */}
            <View style={stylesBaseStylesCreateGasto.rowContainer}>
              {/* Moneda */}
              <View style={stylesBaseStylesCreateGasto.rowItem}>
                <Text style={stylesBaseStylesCreateGasto.label}>Moneda</Text>
                <CustomSelectorCreateGasto
                  label="Seleccionar Moneda"
                  value={formData.moneda}
                  placeholder="Moneda"
                  options={Object.values(Moneda)}
                  onSelect={(value) => handleInputChange("moneda", value)}
                  isVisible={showMonedaModal}
                  onClose={() => setShowMonedaModal(!showMonedaModal)}
                />
              </View>

              {/* Importe */}
              <View style={stylesBaseStylesCreateGasto.rowItem}>
                <Text style={stylesBaseStylesCreateGasto.label}>Importe *</Text>
                <TextInput
                  style={stylesBaseStylesCreateGasto.input}
                  value={importeText}
                  onChangeText={(text) => {
                    // Permitir números decimales (reemplazar comas con puntos)
                    const sanitizedText = text.replace(/,/g, ".");
                    // Solo permitir formatos numéricos válidos (dígitos y máximo un punto decimal)
                    if (
                      sanitizedText === "" ||
                      /^\d*\.?\d*$/.test(sanitizedText)
                    ) {
                      setImporteText(sanitizedText);
                      // Actualizar el valor numérico en formData
                      const numericValue =
                        sanitizedText === ""
                          ? 0
                          : parseFloat(sanitizedText) || 0;
                      handleInputChange("importe", numericValue);
                    }
                  }}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#8A9A97"
                />
              </View>
            </View>

            {/* Sección de Proveedor */}
            <View style={stylesBaseStylesCreateGasto.inputGroup}>
              <TouchableOpacity
                style={stylesBaseStylesCreateGasto.sectionHeader}
                onPress={() => setShowProveedorSection(!showProveedorSection)}
              >
                <View style={stylesBaseStylesCreateGasto.sectionHeaderLeft}>
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={MAIN_COLOR}
                  />
                  <Text style={stylesBaseStylesCreateGasto.sectionHeaderText}>
                    Datos del Proveedor
                  </Text>
                </View>
                <Ionicons
                  name={showProveedorSection ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={MAIN_COLOR}
                />
              </TouchableOpacity>

              {showProveedorSection && (
                <View style={stylesBaseStylesCreateGasto.sectionContent}>
                  {/* Nombre del Proveedor */}
                  <View style={stylesBaseStylesCreateGasto.inputGroup}>
                    <TextInput
                      style={stylesBaseStylesCreateGasto.input}
                      value={formData.proveedor}
                      onChangeText={(text) =>
                        handleInputChange("proveedor", text)
                      }
                      placeholder="Nombre del proveedor"
                      placeholderTextColor="#8A9A97"
                      autoCapitalize="words"
                    />
                  </View>

                  {/* Banco del Proveedor */}
                  <View style={stylesBaseStylesCreateGasto.inputGroup}>
                    <BancoSelector
                      value={formData.proveedor_banco}
                      onSelect={(banco) =>
                        handleInputChange("proveedor_banco", banco)
                      }
                    />
                  </View>

                  {/* Número de Cuenta */}
                  <View style={stylesBaseStylesCreateGasto.inputGroup}>
                    <Text style={stylesBaseStylesCreateGasto.label}>
                      Número de Cuenta
                    </Text>
                    <TextInput
                      style={stylesBaseStylesCreateGasto.input}
                      value={formData.proveedor_cuenta}
                      onChangeText={(text) =>
                        handleInputChange("proveedor_cuenta", text)
                      }
                      placeholder="Número de cuenta del proveedor"
                      placeholderTextColor="#8A9A97"
                      keyboardType="numeric"
                    />
                  </View>

                  {/* CCI */}
                  <View style={stylesBaseStylesCreateGasto.inputGroup}>
                    <Text style={stylesBaseStylesCreateGasto.label}>CCI</Text>
                    <TextInput
                      style={stylesBaseStylesCreateGasto.input}
                      value={formData.proveedor_cci}
                      onChangeText={(text) =>
                        handleInputChange("proveedor_cci", text)
                      }
                      placeholder="CCI del proveedor"
                      placeholderTextColor="#8A9A97"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={stylesBaseStylesCreateGasto.addFileButton}
              onPress={showFileOptions}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={MAIN_COLOR}
              />
              <Text style={stylesBaseStylesCreateGasto.addFileText}>
                Agregar Archivo
              </Text>
            </TouchableOpacity>

            {files.length > 0 && (
              <ListArchivosCreateGasto files={files} removeFile={removeFile} />
            )}

            {/* Observaciones */}
            <View style={stylesBaseStylesCreateGasto.inputGroup}>
              <Text style={stylesBaseStylesCreateGasto.label}>
                Observaciones
              </Text>
              <TextInput
                style={[
                  stylesBaseStylesCreateGasto.input,
                  { height: 80, textAlignVertical: "top" },
                ]}
                value={formData.observaciones}
                onChangeText={(text) =>
                  handleInputChange("observaciones", text)
                }
                placeholder="Observaciones adicionales"
                multiline
                placeholderTextColor="#8A9A97"
              />
            </View>
          </View>
        </ScrollView>

        {/* Botón Submit fijo en la parte inferior */}
        <View style={stylesBaseStylesCreateGasto.bottomContainer}>
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
      </KeyboardAvoidingView>

      {/* Modal para opciones de archivo (Android) */}
      <ModalOpcionesArchivoCreateUpdateGasto
        showFileModal={showFileModal}
        setShowFileModal={setShowFileModal}
        setFiles={setFiles}
      />
    </SafeAreaView>
  );
}
