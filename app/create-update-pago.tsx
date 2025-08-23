import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { MAIN_COLOR } from "./constants";

// Tipos y enums del backend
export enum CategoriaPago {
  RENDICION = "RENDICION",
  COTIZACION = "COTIZACION",
  JOLG = "JOLG",
  CORP_LORENZO = "CORP_LORENZO",
  OSCAR_LORENZO = "OSCAR_LORENZO",
  CONSTRUCCIONES = "CONSTRUCCIONES",
  CASA = "CASA",
  OFICINA = "OFICINA",
}

export enum SubCategoriaPago {
  JOLG_LOCALES = "JOLG_LOCALES",
  JOLG_PRODUCCION = "JOLG_PRODUCCION",
  JOLG_PLANILLA = "JOLG_PLANILLA",
  CORP_LORENZO_LOCAL = "CORP_LORENZO_LOCAL",
  CORP_LORENZO_PRODUCCION = "CORP_LORENZO_PRODUCCION",
  CORP_LORENZO_PLANILLA = "CORP_LORENZO_PLANILLA",
  OSCAR_LORENZO_PERSONAL = "OSCAR_LORENZO_PERSONAL",
  OSCAR_LORENZO_CASA = "OSCAR_LORENZO_CASA",
  CONSTRUCCIONES_OBRAS = "CONSTRUCCIONES_OBRAS",
  CONSTRUCCIONES_HERRAMIENTAS = "CONSTRUCCIONES_HERRAMIENTAS",
  CASA_SERVICIOS = "CASA_SERVICIOS",
  CASA_MANTENIMIENTO = "CASA_MANTENIMIENTO",
  OFICINA_SERVICIOS = "OFICINA_SERVICIOS",
  OFICINA_SUMINISTROS = "OFICINA_SUMINISTROS",
}

export enum TipoPago {
  GASTO = "GASTO",
  INGRESO = "INGRESO",
  TRANSFERENCIA = "TRANSFERENCIA",
}

export enum OrigenPago {
  EFECTIVO = "EFECTIVO",
  BANCO_CONTINENTAL = "BANCO_CONTINENTAL",
  BANCO_NACIONAL = "BANCO_NACIONAL",
  TARJETA_CREDITO = "TARJETA_CREDITO",
  TARJETA_DEBITO = "TARJETA_DEBITO",
}

export enum MonedaPago {
  PYG = "PYG",
  USD = "USD",
  BRL = "BRL",
  ARS = "ARS",
}

// Mapeo de categorías y subcategorías
const CATEGORIA_SUBCATEGORIA_MAP: Record<CategoriaPago, SubCategoriaPago[]> = {
  [CategoriaPago.JOLG]: [
    SubCategoriaPago.JOLG_LOCALES,
    SubCategoriaPago.JOLG_PRODUCCION,
    SubCategoriaPago.JOLG_PLANILLA,
  ],
  [CategoriaPago.CORP_LORENZO]: [
    SubCategoriaPago.CORP_LORENZO_LOCAL,
    SubCategoriaPago.CORP_LORENZO_PRODUCCION,
    SubCategoriaPago.CORP_LORENZO_PLANILLA,
  ],
  [CategoriaPago.OSCAR_LORENZO]: [
    SubCategoriaPago.OSCAR_LORENZO_PERSONAL,
    SubCategoriaPago.OSCAR_LORENZO_CASA,
  ],
  [CategoriaPago.CONSTRUCCIONES]: [
    SubCategoriaPago.CONSTRUCCIONES_OBRAS,
    SubCategoriaPago.CONSTRUCCIONES_HERRAMIENTAS,
  ],
  [CategoriaPago.CASA]: [
    SubCategoriaPago.CASA_SERVICIOS,
    SubCategoriaPago.CASA_MANTENIMIENTO,
  ],
  [CategoriaPago.OFICINA]: [
    SubCategoriaPago.OFICINA_SERVICIOS,
    SubCategoriaPago.OFICINA_SUMINISTROS,
  ],
  [CategoriaPago.RENDICION]: [],
  [CategoriaPago.COTIZACION]: [],
};

interface PaymentFormData {
  descripcion: string;
  categoria: CategoriaPago | null;
  subcategoria: SubCategoriaPago | null;
  tipo: TipoPago | null;
  origen: OrigenPago | null;
  moneda: MonedaPago | null;
  monto: string;
  fechaVencimiento: Date | null;
  observaciones: string;
  ubicacionFisica: string;
  numeroRecibo: string;
}

interface FileItem {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

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

  const addTemporaryFile = (file: any) => {
    const newFile: FileItem = {
      uri: file.uri,
      name: file.name || `file_${Date.now()}`,
      type: file.type || file.mimeType || "unknown",
      size: file.size,
    };
    setFiles((prev) => [...prev, newFile]);
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
              pickFromCamera();
              break;
            case 2:
              pickFromGallery();
              break;
            case 3:
              pickDocument();
              break;
          }
        }
      );
    } else {
      setShowFileModal(true);
    }
  };

  const pickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Error", "Se necesita permiso para acceder a la cámara");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset: any) => addTemporaryFile(asset));
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      Alert.alert("Error", "No se pudo abrir la cámara");
    }
  };

  const pickFromGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Error", "Se necesita permiso para acceder a la galería");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset: any) => addTemporaryFile(asset));
      }
    } catch (error) {
      console.error("Error accessing gallery:", error);
      Alert.alert("Error", "No se pudo abrir la galería");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset: any) => addTemporaryFile(asset));
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "No se pudo seleccionar el documento");
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

  const getAvailableSubcategorias = (): SubCategoriaPago[] => {
    if (!formData.categoria) return [];
    return CATEGORIA_SUBCATEGORIA_MAP[formData.categoria] || [];
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = (type: string): boolean => {
    return type.startsWith("image/");
  };

  // Componente de selector personalizado
  const CustomSelector = ({
    label,
    value,
    placeholder,
    options,
    onSelect,
    isVisible,
    onClose,
    keyExtractor,
    labelExtractor,
  }: {
    label: string;
    value: any;
    placeholder: string;
    options: any[];
    onSelect: (value: any) => void;
    isVisible: boolean;
    onClose: () => void;
    keyExtractor?: (item: any) => string;
    labelExtractor?: (item: any) => string;
  }) => {
    const getDisplayValue = () => {
      if (!value) return placeholder;
      return labelExtractor ? labelExtractor(value) : value;
    };

    return (
      <>
        <TouchableOpacity
          style={styles.customSelector}
          onPress={() => !isVisible && onClose()}
        >
          <Text
            style={[styles.selectorText, !value && styles.selectorPlaceholder]}
          >
            {getDisplayValue()}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={!value ? "#8A9A97" : MAIN_COLOR}
          />
        </TouchableOpacity>

        <Modal
          visible={isVisible}
          transparent
          animationType="slide"
          onRequestClose={onClose}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
            <View style={styles.selectorModalContent}>
              <View style={styles.selectorModalHeader}>
                <Text style={styles.selectorModalTitle}>{label}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={MAIN_COLOR} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.selectorOptions}>
                <TouchableOpacity
                  style={styles.selectorOption}
                  onPress={() => {
                    onSelect(null);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.selectorOptionText,
                      styles.selectorPlaceholder,
                    ]}
                  >
                    {placeholder}
                  </Text>
                  {!value && (
                    <Ionicons name="checkmark" size={20} color={MAIN_COLOR} />
                  )}
                </TouchableOpacity>

                {options.map((option) => {
                  const key = keyExtractor ? keyExtractor(option) : option;
                  const label = labelExtractor
                    ? labelExtractor(option)
                    : option;
                  const isSelected = value === option;

                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.selectorOption}
                      onPress={() => {
                        onSelect(option);
                        onClose();
                      }}
                    >
                      <Text
                        style={[
                          styles.selectorOptionText,
                          isSelected && styles.selectorOptionSelected,
                        ]}
                      >
                        {label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={MAIN_COLOR}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Editar Pago" : "Crear Pago"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={styles.input}
              value={formData.descripcion}
              onChangeText={(text) => handleInputChange("descripcion", text)}
              placeholder="Ingrese una descripción"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <CustomSelector
              label="Seleccionar Categoría"
              value={formData.categoria}
              placeholder="Seleccionar categoría"
              options={Object.values(CategoriaPago)}
              onSelect={(value) => handleInputChange("categoria", value)}
              isVisible={showCategoriaModal}
              onClose={() => setShowCategoriaModal(!showCategoriaModal)}
            />
          </View>

          {formData.categoria && getAvailableSubcategorias().length > 0 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subcategoría</Text>
              <CustomSelector
                label="Seleccionar Subcategoría"
                value={formData.subcategoria}
                placeholder="Seleccionar subcategoría"
                options={getAvailableSubcategorias()}
                onSelect={(value) => handleInputChange("subcategoria", value)}
                isVisible={showSubcategoriaModal}
                onClose={() => setShowSubcategoriaModal(!showSubcategoriaModal)}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo *</Text>
            <CustomSelector
              label="Seleccionar Tipo"
              value={formData.tipo}
              placeholder="Seleccionar tipo"
              options={Object.values(TipoPago)}
              onSelect={(value) => handleInputChange("tipo", value)}
              isVisible={showTipoModal}
              onClose={() => setShowTipoModal(!showTipoModal)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Origen</Text>
            <CustomSelector
              label="Seleccionar Origen"
              value={formData.origen}
              placeholder="Seleccionar origen"
              options={Object.values(OrigenPago)}
              onSelect={(value) => handleInputChange("origen", value)}
              isVisible={showOrigenModal}
              onClose={() => setShowOrigenModal(!showOrigenModal)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Moneda</Text>
            <CustomSelector
              label="Seleccionar Moneda"
              value={formData.moneda}
              placeholder="Seleccionar moneda"
              options={Object.values(MonedaPago)}
              onSelect={(value) => handleInputChange("moneda", value)}
              isVisible={showMonedaModal}
              onClose={() => setShowMonedaModal(!showMonedaModal)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto *</Text>
            <TextInput
              style={styles.input}
              value={formData.monto}
              onChangeText={(text) => handleInputChange("monto", text)}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Recibo</Text>
            <TextInput
              style={styles.input}
              value={formData.numeroRecibo}
              onChangeText={(text) => handleInputChange("numeroRecibo", text)}
              placeholder="Número de recibo (opcional)"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ubicación Física</Text>
            <TextInput
              style={styles.input}
              value={formData.ubicacionFisica}
              onChangeText={(text) =>
                handleInputChange("ubicacionFisica", text)
              }
              placeholder="Ubicación del documento físico"
              placeholderTextColor="#8A9A97"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              value={formData.observaciones}
              onChangeText={(text) => handleInputChange("observaciones", text)}
              placeholder="Observaciones adicionales"
              multiline
              placeholderTextColor="#8A9A97"
            />
          </View>

          {/* Archivos */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Archivos Adjuntos</Text>
          </View>

          <TouchableOpacity
            style={styles.addFileButton}
            onPress={showFileOptions}
          >
            <Ionicons name="add-circle-outline" size={24} color={MAIN_COLOR} />
            <Text style={styles.addFileText}>Agregar Archivo</Text>
          </TouchableOpacity>

          {files.length > 0 && (
            <FlatList
              data={files}
              style={styles.filesList}
              renderItem={({ item, index }) => (
                <View style={styles.fileItem}>
                  {isImage(item.type) ? (
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.fileImage}
                    />
                  ) : (
                    <View style={styles.fileIcon}>
                      <Ionicons
                        name="document-outline"
                        size={24}
                        color={MAIN_COLOR}
                      />
                    </View>
                  )}
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(item.size)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeFileButton}
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
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
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
          style={styles.modalOverlay}
          onPress={() => setShowFileModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Archivo</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowFileModal(false);
                pickFromCamera();
              }}
            >
              <Ionicons name="camera" size={24} color={MAIN_COLOR} />
              <Text style={styles.modalOptionText}>Cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowFileModal(false);
                pickFromGallery();
              }}
            >
              <Ionicons name="image" size={24} color={MAIN_COLOR} />
              <Text style={styles.modalOptionText}>Galería</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowFileModal(false);
                pickDocument();
              }}
            >
              <Ionicons name="document" size={24} color={MAIN_COLOR} />
              <Text style={styles.modalOptionText}>Documentos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, styles.cancelOption]}
              onPress={() => setShowFileModal(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8E6",
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8E6",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN_COLOR,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1E8E6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: MAIN_COLOR,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E1E8E6",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  picker: {
    height: 50,
    color: MAIN_COLOR,
  },
  customSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E1E8E6",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 56,
  },
  selectorText: {
    fontSize: 16,
    color: MAIN_COLOR,
    flex: 1,
  },
  selectorPlaceholder: {
    color: "#8A9A97",
  },
  selectorModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  selectorModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8E6",
  },
  selectorModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
  },
  selectorOptions: {
    maxHeight: 400,
  },
  selectorOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F7F5",
  },
  selectorOptionText: {
    fontSize: 16,
    color: MAIN_COLOR,
    flex: 1,
  },
  selectorOptionSelected: {
    fontWeight: "600",
    color: MAIN_COLOR,
  },
  addFileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: MAIN_COLOR,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  addFileText: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN_COLOR,
    marginLeft: 10,
  },
  filesList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fileImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  fileIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F0F7F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: MAIN_COLOR,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: "#8A9A97",
  },
  removeFileButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#8A9A97",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#F8FAF9",
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN_COLOR,
    marginLeft: 15,
  },
  cancelOption: {
    backgroundColor: "#FEF2F2",
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    textAlign: "center",
    flex: 1,
  },
});
