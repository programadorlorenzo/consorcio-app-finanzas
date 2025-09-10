import { uploadMultipleFiles } from '@/api/files/files-api';
import { crearDetalleRendicion } from '@/api/rendiciones/detalle-rendicion-api';
import { obtenerRendicionActiva } from '@/api/rendiciones/rendiciones-api';
import { MAIN_COLOR } from '@/app/constants';
import ArchivosCreateUpdatePago from '@/components/pagos/create-update-pagos/ArchivosCreateUpdatePago';
import ModalOpcionesArchivoCreateUpdatePago from '@/components/pagos/create-update-pagos/ModalOpcionesArchivoCreateUpdatePago';
import { Rendicion } from '@/types/rendiciones/rendiciones.types';
import { FileItem, pickDocument, pickFromCamera, pickFromGallery } from '@/utils/gastos/create-gasto-utils';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface DetalleRendicionForm {
  descripcion: string;
  fecha: string;
  importe: string;
  banco: string;
  cuentabancaria: string;
  cci: string;
  titular: string;
  observaciones: string;
}

const BANCOS_OPTIONS = [
  'Banco de Crédito',
  'Interbank', 
  'BBVA',
  'Scotiabank',
  'Banco de la Nación',
  'Yape',
  'Plin',
  'Efectivo',
  'Otro'
];

export default function CreateDetalleRendicionScreen() {
  const [rendicionActiva, setRendicionActiva] = useState<Rendicion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<DetalleRendicionForm>({
    descripcion: '',
    fecha: '',
    importe: '',
    banco: '',
    cuentabancaria: '',
    cci: '',
    titular: '',
    observaciones: '',
  });

  // Estado separado para la fecha para el input (formato DD/MM/YYYY)
  const [fechaText, setFechaText] = useState<string>(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });

  // Estados para archivos
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);

  const [showBancoModal, setShowBancoModal] = useState(false);

  const checkRendicionActiva = useCallback(async () => {
    try {
      setLoading(true);
      const rendicion = await obtenerRendicionActiva();
      setRendicionActiva(rendicion);
      
      if (!rendicion) {
        Alert.alert(
          "Sin rendición activa",
          "No tienes una rendición activa. Ve a la pestaña Rendición para crear una nueva.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error("Error al verificar rendición activa:", error);
      Alert.alert("Error", "No se pudo cargar la rendición activa");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkRendicionActiva();
    }, [checkRendicionActiva])
  );

  const handleInputChange = (field: keyof DetalleRendicionForm, value: string) => {
    if (field === 'descripcion') {
      value = value.toUpperCase(); // Convertir descripción a mayúsculas
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Manejo de fecha con formato DD/MM/YYYY
  const handleFechaChange = (text: string) => {
    // Limpiar texto - solo números
    const numbersOnly = text.replace(/\D/g, "");

    let formatted = numbersOnly;

    // Agregar barras automáticamente
    if (numbersOnly.length >= 3) {
      formatted =
        numbersOnly.slice(0, 2) +
        "/" +
        numbersOnly.slice(2, 4) +
        "/" +
        numbersOnly.slice(4, 8);
    } else if (numbersOnly.length >= 1) {
      formatted =
        numbersOnly.slice(0, 2) +
        "/" +
        numbersOnly.slice(2, 4) +
        "/" +
        numbersOnly.slice(4, 8);
    }

    // Limitar a 10 caracteres (DD/MM/YYYY)
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }

    setFechaText(formatted);

    // Validar formato completo DD/MM/YYYY
    const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (fechaRegex.test(formatted)) {
      // Convertir DD/MM/YYYY a Date
      const [dia, mes, año] = formatted.split("/");
      const fecha = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));

      // Verificar que la fecha sea válida
      if (
        !isNaN(fecha.getTime()) &&
        fecha.getDate() === parseInt(dia) &&
        fecha.getMonth() === parseInt(mes) - 1 &&
        fecha.getFullYear() === parseInt(año)
      ) {
        const fechaISO = fecha.toISOString();
        setFormData((prev) => ({
          ...prev,
          fecha: fechaISO,
        }));
      }
    } else if (text === "") {
      // Si está vacío, usar la fecha actual
      setFormData((prev) => ({
        ...prev,
        fecha: new Date().toISOString(),
      }));
    }
  };

  // Funciones para manejo de archivos
  const addFile = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Cámara', 'Galería', 'Documento'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 1:
              await handleAddFileFromCamera();
              break;
            case 2:
              await handleAddFileFromGallery();
              break;
            case 3:
              await handleAddFileFromDocuments();
              break;
          }
        }
      );
    } else {
      setShowFileModal(true);
    }
  };

  const handleAddFileFromCamera = async () => {
    await pickFromCamera(setFiles);
  };

  const handleAddFileFromGallery = async () => {
    await pickFromGallery(setFiles);
  };

  const handleAddFileFromDocuments = async () => {
    await pickDocument(setFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];

    try {
      // Convertir FileItem[] a FileToUpload[]
      const filesToUpload = files.map((file) => ({
        uri: file.uri,
        fileName: file.name,
        type: file.type,
      }));

      const uploadedFilePaths = await uploadMultipleFiles(filesToUpload);
      return uploadedFilePaths;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.descripcion.trim()) {
      Alert.alert("Error", "La descripción es obligatoria");
      return;
    }

    if (!formData.importe || parseFloat(formData.importe) <= 0) {
      Alert.alert("Error", "El importe debe ser mayor a 0");
      return;
    }

    if (!rendicionActiva) {
      Alert.alert("Error", "No hay rendición activa");
      return;
    }

    // Validaciones de negocio
    const importeDetalle = parseFloat(formData.importe);
    const totalRendido = parseFloat(String(rendicionActiva.total_rendido)) || 0;
    const totalIniciado = parseFloat(String(rendicionActiva.total_iniciado)) || 0;
    const saldoActual = totalIniciado - totalRendido;

    // Validar que no se exceda el saldo
    if (saldoActual <= 0) {
      Alert.alert(
        "No se puede agregar detalle", 
        "El total rendido ya es igual al saldo inicial. No se pueden agregar más detalles."
      );
      return;
    }

    if (importeDetalle > saldoActual) {
      Alert.alert(
        "Importe excede el saldo", 
        `El importe S/ ${importeDetalle.toFixed(2)} excede el saldo disponible de S/ ${saldoActual.toFixed(2)}`
      );
      return;
    }

    try {
      setSaving(true);
      
      // 1. Subir archivos primero (si hay)
      let uploadedFilePaths: string[] = [];
      if (files.length > 0) {
        console.log("📤 Subiendo archivos...");
        uploadedFilePaths = await uploadFiles();
        console.log("📁 Archivos subidos:", uploadedFilePaths);
      }
      
      // 2. Crear detalle de rendición
      // TODO: Implementar la API para crear detalle de rendición
      const detalleData = {
        rendicionId: rendicionActiva.id,
        descripcion: formData.descripcion.trim(),
        fecha: formData.fecha,
        importeUnitario: parseFloat(formData.importe),
        cantidad: 1, // Siempre 1 por ahora
        importeTotal: parseFloat(formData.importe), // Igual al unitario cuando cantidad = 1
        banco: formData.banco || undefined,
        cuentabancaria: formData.cuentabancaria.trim() || undefined,
        cci: formData.cci.trim() || undefined,
        titular: formData.titular.trim() || undefined,
        observaciones: formData.observaciones.trim() || undefined,
        rutasArchivos: uploadedFilePaths,
      };
      
      console.log("📝 Datos del detalle:", detalleData);
      await crearDetalleRendicion(detalleData);
      
      Alert.alert(
        "Éxito",
        "Detalle agregado correctamente",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error al crear detalle:", error);
      Alert.alert("Error", "No se pudo agregar el detalle");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.title}>Agregar Detalle</Text>
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={MAIN_COLOR} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Agregar Detalle</Text>
          <Text style={styles.subtitle}>
            Nuevo gasto para tu rendición
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
            {/* Descripción */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.descripcion}
                onChangeText={(text) => handleInputChange('descripcion', text)}
                placeholder="Describe el gasto realizado"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Fecha */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fecha *</Text>
              <TextInput
                style={styles.textInput}
                value={fechaText}
                onChangeText={handleFechaChange}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Importe */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Importe *</Text>
              <View style={styles.moneyInputWrapper}>
                <Text style={styles.currencyLabel}>S/</Text>
                <TextInput
                  style={styles.moneyInput}
                  value={formData.importe}
                  onChangeText={(text) => handleInputChange('importe', text)}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Datos bancarios */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Datos de Destino del Pago</Text>
              
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
                  value={formData.cuentabancaria}
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
                  value={formData.cci}
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
                  value={formData.titular}
                  onChangeText={(text) => handleInputChange('titular', text)}
                  placeholder="Nombre del titular"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Observaciones */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observaciones</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.observaciones}
                onChangeText={(text) => handleInputChange('observaciones', text)}
                placeholder="Observaciones adicionales (opcional)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Archivos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Archivos Adjuntos</Text>
              <ArchivosCreateUpdatePago
                files={files}
                onAddFile={addFile}
                onRemoveFile={removeFile}
              />
            </View>
          </ScrollView>

          {/* Footer con botón de guardar */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                saving && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>
                    Agregar Detalle
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      {/* Modal de bancos */}
      {showBancoModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Banco</Text>
              <TouchableOpacity onPress={() => setShowBancoModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {BANCOS_OPTIONS.map((banco, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalOption,
                    formData.banco === banco && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    handleInputChange('banco', banco);
                    setShowBancoModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    formData.banco === banco && styles.modalOptionTextSelected
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
      )}

      {/* Modal de archivos */}
      <ModalOpcionesArchivoCreateUpdatePago
        visible={showFileModal}
        onClose={() => setShowFileModal(false)}
        onCamera={handleAddFileFromCamera}
        onGallery={handleAddFileFromGallery}
        onDocument={handleAddFileFromDocuments}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: MAIN_COLOR,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  
  // Formulario
  section: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  
  // Money Input
  moneyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: MAIN_COLOR,
    marginRight: 8,
  },
  moneyInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    padding: 0,
  },
  
  // Selector
  selectorButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#374151',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: MAIN_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  modalContent: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOptionTextSelected: {
    color: MAIN_COLOR,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  moneyInputReadOnly: {
    flex: 1,
    fontSize: 16,
    color: '#6B7280',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
