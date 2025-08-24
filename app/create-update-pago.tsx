import { uploadMultipleFiles } from "@/api/files/files-api";
import { obtenerGasto } from "@/api/gastos/gastos-api";
import { createPago, updatePago } from "@/api/pagos/pagos-api";
import { MAIN_COLOR } from "@/app/constants";
import ArchivosCreateUpdatePago from "@/components/pagos/create-update-pagos/ArchivosCreateUpdatePago";
import CustomSelectorCreatePago from "@/components/pagos/create-update-pagos/CustomSelectorCreatePago";
import CustomSwitchCreatePago from "@/components/pagos/create-update-pagos/CustomSwitchCreatePago";
import ModalOpcionesArchivoCreateUpdatePago from "@/components/pagos/create-update-pagos/ModalOpcionesArchivoCreateUpdatePago";
import { stylesBaseStylesCreatePago } from "@/styles/pagos/base-create-update-pago.styles";
import {
    Gasto,
    Moneda,
    OrigenPago,
    PagoCreateDto,
    TipoPago,
} from "@/types/gastos/gastos.types";
import {
    FileItem,
    pickDocument,
    pickFromCamera,
    pickFromGallery,
} from "@/utils/gastos/create-gasto-utils";
import { formatDisplayText } from "@/utils/gastos/custom_selector_create_update_gasto.utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateUpdatePago() {
  const params = useLocalSearchParams();
  const isEditing = !!params.pagoId;
  const gastoId = params.gastoId ? Number(params.gastoId) : undefined;

  const [formData, setFormData] = useState<PagoCreateDto>({
    tipo: undefined,
    origen: OrigenPago.EXTERNO, // Por defecto externo
    gastoId: gastoId || 0,
    rendicionId: 0,
    usuarioRegistroPagoId: 0,
    fechaRegistro: new Date().toISOString(),
    titular_origen: "",
    cuenta_bancaria_origen: "",
    cci_origen: "",
    banco_origen: "",
    moneda_origen: Moneda.SOLES,
    titular_destino: "",
    cuenta_bancaria_destino: "",
    cci_destino: "",
    banco_destino: "",
    moneda_destino: Moneda.SOLES,
    tipo_cambio: 0,
    importe: 0,
    moneda: Moneda.SOLES,
    numeroOperacion: "",
    rutasArchivos: [],
  });

  // Estado separado para el importe como string para manejar decimales
  const [importeText, setImporteText] = useState<string>("");

  // Estados para modales
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showMonedaModal, setShowMonedaModal] = useState(false);

  // Estados para archivos
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para información del gasto
  const [gastoInfo, setGastoInfo] = useState<Gasto | null>(null);
  const [loadingGasto, setLoadingGasto] = useState(false);

  useEffect(() => {
    const loadGastoInfo = async () => {
      if (gastoId) {
        setLoadingGasto(true);
        try {
          const gasto = await obtenerGasto(gastoId);
          setGastoInfo(gasto);
          setFormData((prev) => ({
            ...prev,
            gastoId: gastoId,
            importe: 0,
            moneda: gasto.moneda || Moneda.SOLES,
          }));
          setImporteText("");
        } catch (error) {
          console.error("Error cargando información del gasto:", error);
          Alert.alert("Error", "No se pudo cargar la información del gasto");
        } finally {
          setLoadingGasto(false);
        }
      }
    };

    loadGastoInfo();
  }, [gastoId]);

  const handleInputChange = (field: keyof PagoCreateDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImporteChange = (text: string) => {
    setImporteText(text);
    const numericValue = parseFloat(text.replace(",", ".")) || 0;
    setFormData((prev) => ({
      ...prev,
      importe: numericValue,
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

  const validateForm = (): boolean => {
    if (!formData.gastoId) {
      Alert.alert("Error", "El pago debe estar asociado a un gasto");
      return false;
    }
    if (formData.importe && formData.importe <= 0) {
      Alert.alert("Error", "El importe debe ser mayor a 0");
      return false;
    }
    if (formData.numeroOperacion && !formData.numeroOperacion.trim()) {
      Alert.alert("Error", "El número de operación es requerido");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Subir archivos primero
      let uploadedFilePaths: string[] = [];
      if (files.length > 0) {
        console.log("📤 Subiendo archivos...");

        // Convertir FileItem[] a FileToUpload[]
        const filesToUpload = files.map((file) => ({
          uri: file.uri,
          fileName: file.name,
          type: file.type,
        }));

        uploadedFilePaths = await uploadMultipleFiles(filesToUpload);
        console.log("📁 Archivos subidos:", uploadedFilePaths);
      }

      // 2. Crear o actualizar el pago con las rutas de los archivos
      const pagoData: PagoCreateDto = {
        ...formData,
        rutasArchivos: uploadedFilePaths,
      };

      if (isEditing) {
        // TODO: Implementar lógica de actualización
        await updatePago(Number(params.pagoId), pagoData);
        console.log("✅ Pago actualizado exitosamente:", pagoData);
        Alert.alert("Éxito", "Pago actualizado exitosamente");
      } else {
        // Crear nuevo pago
        await createPago(pagoData);
        console.log("✅ Pago creado exitosamente:", pagoData);
        Alert.alert("Éxito", "Pago registrado exitosamente");
      }

      // Limpiar formulario y archivos
      setFormData({
        tipo: undefined,
        origen: OrigenPago.CUENTA_EMPRESA,
        gastoId: gastoId || 0,
        rendicionId: 0,
        usuarioRegistroPagoId: 0,
        fechaRegistro: new Date().toISOString(),
        titular_origen: "",
        cuenta_bancaria_origen: "",
        cci_origen: "",
        banco_origen: "",
        moneda_origen: Moneda.SOLES,
        titular_destino: "",
        cuenta_bancaria_destino: "",
        cci_destino: "",
        banco_destino: "",
        moneda_destino: Moneda.SOLES,
        tipo_cambio: 0,
        importe: 0,
        moneda: Moneda.SOLES,
        numeroOperacion: "",
        rutasArchivos: [],
      });
      setFiles([]);
      setImporteText("");

      router.back();
    } catch (error) {
      console.error("❌ Error registrando pago:", error);
      Alert.alert(
        "Error",
        "Error al registrar el pago. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

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
          {isEditing ? "Editar Pago" : "Registrar Pago"}
        </Text>
        <View style={stylesBaseStylesCreatePago.headerSpacer} />
      </View>

      <ScrollView style={stylesBaseStylesCreatePago.scrollView}>
        {/* Información del gasto */}
        {gastoInfo && (
          <View style={stylesBaseStylesCreatePago.gastoInfoContainer}>
            <Text style={stylesBaseStylesCreatePago.gastoInfoTitle}>
              📋 Gasto a pagar:
            </Text>
            <Text style={stylesBaseStylesCreatePago.gastoInfoDescription}>
              {gastoInfo.descripcion}
            </Text>
            <View style={stylesBaseStylesCreatePago.gastoInfoDetails}>
              <Text style={stylesBaseStylesCreatePago.gastoInfoCategory}>
                {formatDisplayText(gastoInfo.categoria || "")}
                {gastoInfo.subcategoria &&
                  ` > ${formatDisplayText(gastoInfo.subcategoria)}`}
              </Text>
              <Text style={stylesBaseStylesCreatePago.gastoInfoAmount}>
                {gastoInfo.moneda} {gastoInfo.importe}
              </Text>
            </View>
          </View>
        )}

        {loadingGasto && (
          <View style={stylesBaseStylesCreatePago.loadingContainer}>
            <ActivityIndicator size="small" color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreatePago.loadingText}>
              Cargando información del gasto...
            </Text>
          </View>
        )}

        {/* Campos del formulario */}
        <View style={stylesBaseStylesCreatePago.formContainer}>
          {/* Tipo de Pago */}
          <CustomSelectorCreatePago
            label="Tipo"
            value={formData.tipo}
            placeholder="Selecciona el tipo de pago"
            options={Object.values(TipoPago)}
            onSelect={(value) => handleInputChange("tipo", value)}
            isVisible={showTipoModal}
            onClose={() => setShowTipoModal(!showTipoModal)}
            required
          />

          {/* Importe */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Importe <Text style={stylesBaseStylesCreatePago.required}>*</Text>
            </Text>
            <View style={stylesBaseStylesCreatePago.importeContainer}>
              <CustomSelectorCreatePago
                label=""
                value={formData.moneda}
                placeholder="Moneda"
                options={Object.values(Moneda)}
                onSelect={(value) => handleInputChange("moneda", value)}
                isVisible={showMonedaModal}
                onClose={() => setShowMonedaModal(!showMonedaModal)}
                containerStyle={stylesBaseStylesCreatePago.monedaSelector}
              />
              <TextInput
                style={stylesBaseStylesCreatePago.importeInput}
                value={importeText}
                onChangeText={handleImporteChange}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Origen */}
          <CustomSwitchCreatePago
            label="Origen"
            leftLabel="Cuenta Empresa"
            rightLabel="Externo"
            value={formData.origen === OrigenPago.CUENTA_EMPRESA}
            onValueChange={(isLeft) => {
              setFormData({
                ...formData,
                origen: isLeft ? OrigenPago.CUENTA_EMPRESA : OrigenPago.EXTERNO,
              });
            }}
          />

          {/* Número de Operación */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Número de Operación{" "}
              <Text style={stylesBaseStylesCreatePago.required}>*</Text>
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.textInput}
              value={formData.numeroOperacion}
              onChangeText={(text) =>
                handleInputChange("numeroOperacion", text)
              }
              placeholder="Ingrese el número de operación"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Titular Origen */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Titular Origen
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.textInput}
              value={formData.titular_origen}
              onChangeText={(text) => handleInputChange("titular_origen", text)}
              placeholder="Nombre del titular de origen"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Banco Origen */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Banco Origen
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.textInput}
              value={formData.banco_origen}
              onChangeText={(text) => handleInputChange("banco_origen", text)}
              placeholder="Nombre del banco de origen"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Cuenta Bancaria Origen */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Cuenta Bancaria Origen
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.textInput}
              value={formData.cuenta_bancaria_origen}
              onChangeText={(text) =>
                handleInputChange("cuenta_bancaria_origen", text)
              }
              placeholder="Número de cuenta bancaria de origen"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Titular Destino */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Titular Destino
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.textInput}
              value={formData.titular_destino}
              onChangeText={(text) =>
                handleInputChange("titular_destino", text)
              }
              placeholder="Nombre del titular de destino"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Banco Destino */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Banco Destino
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.textInput}
              value={formData.banco_destino}
              onChangeText={(text) => handleInputChange("banco_destino", text)}
              placeholder="Nombre del banco de destino"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Cuenta Bancaria Destino */}
          <View style={stylesBaseStylesCreatePago.fieldContainer}>
            <Text style={stylesBaseStylesCreatePago.fieldLabel}>
              Cuenta Bancaria Destino
            </Text>
            <TextInput
              style={stylesBaseStylesCreatePago.textInput}
              value={formData.cuenta_bancaria_destino}
              onChangeText={(text) =>
                handleInputChange("cuenta_bancaria_destino", text)
              }
              placeholder="Número de cuenta bancaria de destino"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Archivos */}
          <ArchivosCreateUpdatePago
            files={files}
            onAddFile={showFileOptions}
            onRemoveFile={removeFile}
          />
        </View>
      </ScrollView>

      {/* Botón de Submit */}
      <View style={stylesBaseStylesCreatePago.bottomContainer}>
        <TouchableOpacity
          style={[
            stylesBaseStylesCreatePago.submitButton,
            loading && stylesBaseStylesCreatePago.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={stylesBaseStylesCreatePago.submitButtonText}>
              {isEditing ? "Actualizar Pago" : "Registrar Pago"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ModalOpcionesArchivoCreateUpdatePago
        visible={showFileModal}
        onClose={() => setShowFileModal(false)}
        onCamera={() => pickFromCamera(setFiles)}
        onGallery={() => pickFromGallery(setFiles)}
        onDocument={() => pickDocument(setFiles)}
      />
    </SafeAreaView>
  );
}
