import { Gasto, Moneda, OrigenPago, PagoCreateDto, TipoPago } from "@/types/gastos/gastos.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { stylesListGastos } from "../../styles/gastos/list-gastos.styles";

interface ModalRegistrarPagoProps {
  visible: boolean;
  onClose: () => void;
  gasto: Gasto;
}

const ModalRegistrarPago: React.FC<ModalRegistrarPagoProps> = ({
  visible,
  onClose,
  gasto,
}) => {
  const [formData, setFormData] = useState<PagoCreateDto>({
    tipo: TipoPago.EFECTIVO,
    origen: OrigenPago.CUENTA_EMPRESA,
    gastoId: gasto.id,
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
    importe: gasto.importe || 0,
    moneda: gasto.moneda || Moneda.SOLES,
    numeroOperacion: "",
    rutasArchivos: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Implementar API de creación de pago
      console.log("Registrar pago:", formData);
      Alert.alert("Éxito", "Pago registrado correctamente");
      onClose();
    } catch (error) {
      console.error("Error al registrar pago:", error);
      Alert.alert("Error", "No se pudo registrar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={stylesListGastos.pagoModalOverlay}>
        <SafeAreaView style={stylesListGastos.pagoModalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />
          
          {/* Header */}
          <View style={stylesListGastos.pagoModalHeader}>
            <Text style={stylesListGastos.pagoModalTitle}>Registrar Pago</Text>
            <TouchableOpacity onPress={onClose} style={stylesListGastos.pagoModalCloseButton}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Info del gasto */}
          <View style={stylesListGastos.pagoGastoInfo}>
            <Text style={stylesListGastos.pagoGastoDescription}>{gasto.descripcion}</Text>
            <Text style={stylesListGastos.pagoGastoAmount}>
              {gasto.moneda} {gasto.importe}
            </Text>
          </View>

          <ScrollView style={stylesListGastos.pagoModalContent}>
            {/* Tipo de pago */}
            <View style={stylesListGastos.pagoFieldContainer}>
              <Text style={stylesListGastos.pagoFieldLabel}>Tipo de Pago</Text>
              {/* TODO: Implementar selector para tipo de pago */}
              <Text style={stylesListGastos.pagoFieldValue}>{formData.tipo}</Text>
            </View>

            {/* Origen */}
            <View style={stylesListGastos.pagoFieldContainer}>
              <Text style={stylesListGastos.pagoFieldLabel}>Origen</Text>
              {/* TODO: Implementar selector para origen */}
              <Text style={stylesListGastos.pagoFieldValue}>{formData.origen}</Text>
            </View>

            {/* Importe */}
            <View style={stylesListGastos.pagoFieldContainer}>
              <Text style={stylesListGastos.pagoFieldLabel}>Importe</Text>
              <View style={stylesListGastos.pagoAmountContainer}>
                <Text style={stylesListGastos.pagoAmountCurrency}>{formData.moneda}</Text>
                <Text style={stylesListGastos.pagoAmountValue}>{formData.importe}</Text>
              </View>
            </View>

            {/* Número de operación */}
            <View style={stylesListGastos.pagoFieldContainer}>
              <Text style={stylesListGastos.pagoFieldLabel}>Número de Operación</Text>
              <TextInput
                style={stylesListGastos.pagoTextInput}
                value={formData.numeroOperacion}
                onChangeText={(text) => setFormData({ ...formData, numeroOperacion: text })}
                placeholder="Ingrese el número de operación"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </ScrollView>

          {/* Footer con botones */}
          <View style={stylesListGastos.pagoModalFooter}>
            <TouchableOpacity
              style={stylesListGastos.pagoCancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={stylesListGastos.pagoCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                stylesListGastos.pagoSubmitButton,
                isLoading && stylesListGastos.pagoSubmitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={stylesListGastos.pagoSubmitButtonText}>
                  Registrar Pago
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default ModalRegistrarPago;
