import { uploadMultipleFiles } from "@/api/files/files-api";
import { crearRendicion } from "@/api/rendiciones/rendiciones-api";
import ListArchivosCreateGasto from "@/components/gastos/create-update-pagos/ArchivosCreateUpdateGasto";
import ModalOpcionesArchivo from "@/components/gastos/create-update-pagos/ModalOpcionesArchivoCreateUpdateGasto";
import { useAuth } from "@/components/providers/AuthProvider";
import { stylesBaseStylesCreateGasto } from "@/styles/gastos/base-create-update-gasto.styles";
import { FormaPago, RendicionCreate } from "@/types/rendiciones/rendiciones.types";
import { FileItem } from "@/utils/gastos/create-gasto-utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
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

// Opciones de banco/billetera digital
const BANCOS_OPTIONS = [
  'BCP',
  'INTERBANK', 
  'BBVA',
  'SCOTIABANK',
  'YAPE',
  'PLIN'
];

export default function CreateRendicion() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<RendicionCreate>({
    total_iniciado: 0,
    formaPago: FormaPago.YAPE,
    banco: "",
    cuentabancaria: "",
    cci: "",
    titular: "",
  });

  // Estado separado para el saldo como string para manejar decimales
  const [saldoText, setSaldoText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  
  // Estados para archivos
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);

  const handleSaldoChange = (text: string) => {
    // Permitir números y un punto decimal
    const cleanText = text.replace(/[^0-9.]/g, "");
    
    // Asegurar que solo haya un punto decimal
    const parts = cleanText.split(".");
    let finalText = parts[0];
    if (parts.length > 1) {
      finalText += "." + parts[1];
    }
    
    setSaldoText(finalText);
    
    // Actualizar el valor numérico en formData
    const numericValue = parseFloat(finalText) || 0;
    setFormData(prev => ({
      ...prev,
      total_iniciado: numericValue
    }));
  };

  const handleInputChange = (field: keyof RendicionCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    // El saldo inicial puede ser cero o mayor
    if (formData.total_iniciado < 0) {
      Alert.alert("Error", "El saldo inicial no puede ser negativo");
      return false;
    }

    if (!user?.id) {
      Alert.alert("Error", "No se pudo identificar el usuario");
      return false;
    }

    return true;
  };

  // Funciones para manejar archivos
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddFile = () => {
    setShowFileModal(true);
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];
    
    try {
      console.log("🚀 Subiendo archivos:", files.length);
      
      // Preparar archivos para upload
      const filesToUpload = files.map(file => ({
        uri: file.uri,
        fileName: file.name,
        type: file.type,
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
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // 1. Subir archivos primero (si hay alguno)
      const uploadedFilePaths = await uploadFiles();
      console.log("📁 Archivos subidos:", uploadedFilePaths);
      
      // 2. Crear la rendición
      await crearRendicion(formData, user!.id);
      
      Alert.alert(
        "Éxito",
        "Rendición creada exitosamente",
        [
          {
            text: "OK",
            onPress: () => {
              // Limpiar formulario y archivos
              setFormData({
                total_iniciado: 0,
                formaPago: FormaPago.YAPE,
                banco: "",
                cuentabancaria: "",
                cci: "",
                titular: "",
              });
              setSaldoText("");
              setFiles([]);
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al crear rendición:", error);
      Alert.alert(
        "Error",
        "No se pudo crear la rendición. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={stylesBaseStylesCreateGasto.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={stylesBaseStylesCreateGasto.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={stylesBaseStylesCreateGasto.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={MAIN_COLOR} />
          </TouchableOpacity>
          <Text style={stylesBaseStylesCreateGasto.headerTitle}>
            Nueva Rendición
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Información del responsable */}
            <View style={styles.section}>
              <Text style={stylesBaseStylesCreateGasto.sectionTitle}>
                Responsable
              </Text>
              <View style={styles.responsableCard}>
                <View style={styles.responsableInfo}>
                  <Ionicons name="person-circle" size={40} color={MAIN_COLOR} />
                  <View style={styles.responsableText}>
                    <Text style={styles.responsableNombre}>
                      {user?.nombre || "Usuario"}
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>RENDIDOR</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Saldo inicial */}
            <View style={styles.section}>
              <Text style={stylesBaseStylesCreateGasto.sectionTitle}>
                Saldo Inicial *
              </Text>
              <View style={styles.moneyInputContainer}>
                <View style={styles.moneyInputWrapper}>
                  <Text style={styles.currencyLabel}>S/</Text>
                  <TextInput
                    style={styles.moneyInput}
                    value={saldoText}
                    onChangeText={handleSaldoChange}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              <Text style={styles.helpText}>
                Ingresa el monto inicial (puede ser 0 si aún no recibes dinero)
              </Text>
            </View>

            {/* Información adicional */}
            <View style={styles.section}>
              <View style={styles.responsableCard}>
                <View style={styles.infoRow}>
                  <Ionicons 
                    name="information-circle-outline" 
                    size={20} 
                    color={MAIN_COLOR} 
                  />
                  <Text style={styles.infoDescription}>
                    Una vez creada la rendición, podrás agregar gastos y gestionar 
                    los documentos necesarios para la aprobación.
                  </Text>
                </View>
              </View>
            </View>

            {/* Datos bancarios */}
            <View style={styles.section}>
              <Text style={stylesBaseStylesCreateGasto.sectionTitle}>
                Datos Bancarios
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Banco / Billetera Digital</Text>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() => setShowBancoModal(true)}
                >
                  <Text style={[styles.selectorText, !formData.banco && styles.placeholderText]}>
                    {formData.banco || "Seleccionar banco o billetera"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de Cuenta / Celular</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.cuentabancaria || ""}
                  onChangeText={(text) => handleInputChange('cuentabancaria', text)}
                  placeholder="Número de cuenta o celular"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CCI</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.cci || ""}
                  onChangeText={(text) => handleInputChange('cci', text)}
                  placeholder="Código de Cuenta Interbancario"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titular</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.titular || ""}
                  onChangeText={(text) => handleInputChange('titular', text)}
                  placeholder="Nombre del titular"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Archivos */}
            <View style={styles.section}>
              <Text style={stylesBaseStylesCreateGasto.sectionTitle}>
                Archivos de Soporte
              </Text>
              
              <TouchableOpacity
                style={styles.addFileButton}
                onPress={handleAddFile}
              >
                <Ionicons name="attach" size={20} color={MAIN_COLOR} />
                <Text style={styles.addFileButtonText}>
                  Agregar archivos (opcional)
                </Text>
              </TouchableOpacity>
              
              {files.length > 0 && (
                <ListArchivosCreateGasto files={files} removeFile={removeFile} />
              )}
            </View>
          </ScrollView>

          {/* Footer con botón de crear */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                stylesBaseStylesCreateGasto.submitButton,
                (formData.total_iniciado < 0 || loading) &&
                  stylesBaseStylesCreateGasto.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={formData.total_iniciado < 0 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>
                    Crear Rendición
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Modal de selección de banco */}
      <Modal
        visible={showBancoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBancoModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Seleccionar Banco/Billetera</Text>
              <TouchableOpacity onPress={() => setShowBancoModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={modalStyles.optionsContainer}>
              {BANCOS_OPTIONS.map((banco, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    modalStyles.option,
                    formData.banco === banco && modalStyles.selectedOption
                  ]}
                  onPress={() => {
                    handleInputChange('banco', banco);
                    setShowBancoModal(false);
                  }}
                >
                  <Text style={[
                    modalStyles.optionText,
                    formData.banco === banco && modalStyles.selectedOptionText
                  ]}>
                    {banco}
                  </Text>
                  {formData.banco === banco && (
                    <Ionicons name="checkmark" size={20} color={MAIN_COLOR} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de archivos */}
      <ModalOpcionesArchivo
        showFileModal={showFileModal}
        setShowFileModal={setShowFileModal}
        setFiles={setFiles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  
  // Responsable Card con badge
  responsableCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  responsableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responsableText: {
    marginLeft: 12,
    flex: 1,
  },
  responsableNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Money Input mejorado
  moneyInputContainer: {
    marginBottom: 8,
  },
  moneyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  currencyLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: MAIN_COLOR,
    marginRight: 12,
  },
  moneyInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    padding: 0,
  },

  // Campos de texto bancarios
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Selector de banco
  selectorButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: {
    fontSize: 16,
    color: '#374151',
  },
  placeholderText: {
    color: '#9CA3AF',
  },

  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Botón agregar archivos
  addFileButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: MAIN_COLOR,
    borderStyle: 'dashed',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addFileButtonText: {
    color: MAIN_COLOR,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  optionsContainer: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#F0F9FF',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: MAIN_COLOR,
    fontWeight: '600',
  },
});
