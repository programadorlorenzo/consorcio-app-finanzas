import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

interface FormularioDetalleProps {
  formData: DetalleRendicionForm;
  onFormDataChange: (newData: Partial<DetalleRendicionForm>) => void;
  onBancoPress: () => void;
  saldoDisponible?: number;
}

export default function FormularioDetalle({ 
  formData, 
  onFormDataChange, 
  onBancoPress,
  saldoDisponible 
}: FormularioDetalleProps) {
  
  const handleFechaChange = (text: string) => {
    // Eliminar caracteres no numéricos
    const numbers = text.replace(/\D/g, '');
    
    // Formatear como DD/MM/YYYY
    let formattedText = '';
    for (let i = 0; i < numbers.length && i < 8; i++) {
      if (i === 2 || i === 4) {
        formattedText += '/';
      }
      formattedText += numbers[i];
    }
    
    onFormDataChange({ fecha: formattedText });
  };

  const handleDescripcionChange = (text: string) => {
    // Convertir automáticamente a mayúsculas
    onFormDataChange({ descripcion: text.toUpperCase() });
  };

  return (
    <View style={styles.formContainer}>
      {/* Descripción */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.descripcion}
          onChangeText={handleDescripcionChange}
          placeholder="INGRESE LA DESCRIPCIÓN DEL GASTO"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Fecha */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha *</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={[styles.textInput, styles.textInputWithIcon]}
            value={formData.fecha}
            onChangeText={handleFechaChange}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      {/* Importe */}
      <View style={styles.inputGroup}>
        <View style={styles.importeHeader}>
          <Text style={styles.label}>Importe *</Text>
          {saldoDisponible !== undefined && (
            <Text style={styles.saldoInfo}>
              Saldo disponible: S/ {saldoDisponible.toFixed(2)}
            </Text>
          )}
        </View>
        <View style={styles.inputWithIcon}>
          <Text style={styles.currencySymbol}>S/</Text>
          <TextInput
            style={[styles.textInput, styles.textInputWithIcon]}
            value={formData.importe}
            onChangeText={(text) => onFormDataChange({ importe: text })}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Información Bancaria */}
      <View style={styles.bankSection}>
        <Text style={styles.sectionTitle}>Destino de Pago</Text>
        <Text style={styles.sectionSubtitle}>
          Información bancaria donde se realizará el pago
        </Text>

        {/* Banco */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Banco</Text>
          <TouchableOpacity style={styles.selectInput} onPress={onBancoPress}>
            <Text style={[styles.selectText, !formData.banco && styles.placeholderText]}>
              {formData.banco || 'Seleccionar banco'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Titular */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Titular</Text>
          <TextInput
            style={styles.textInput}
            value={formData.titular}
            onChangeText={(text) => onFormDataChange({ titular: text })}
            placeholder="Nombre del titular de la cuenta"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Número de cuenta */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Cuenta</Text>
          <TextInput
            style={styles.textInput}
            value={formData.cuentabancaria}
            onChangeText={(text) => onFormDataChange({ cuentabancaria: text })}
            placeholder="Número de cuenta bancaria"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        {/* CCI */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>CCI</Text>
          <TextInput
            style={styles.textInput}
            value={formData.cci}
            onChangeText={(text) => onFormDataChange({ cci: text })}
            placeholder="Código de Cuenta Interbancario"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Observaciones */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Observaciones</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={formData.observaciones}
          onChangeText={(text) => onFormDataChange({ observaciones: text })}
          placeholder="Información adicional (opcional)"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#111827',
  },
  textInputWithIcon: {
    paddingLeft: 45,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    top: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    zIndex: 1,
  },
  importeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  saldoInfo: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  bankSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
});
