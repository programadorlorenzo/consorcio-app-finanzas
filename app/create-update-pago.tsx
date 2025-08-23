import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { MAIN_COLOR } from './constants';

interface PagoFormData {
  monto: string;
  concepto: string;
  fecha: string;
  codigo: string;
}

const CreateUpdatePago = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<PagoFormData>({
    monto: '',
    concepto: '',
    fecha: '',
    codigo: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      // Aquí cargarías los datos del pago a editar basado en el ID
      console.log('Cargando datos del pago con ID:', id);
      // Simulando carga de datos
      // loadPaymentData(id);
    }
  }, [id, isEdit]);

  const handleInputChange = (field: keyof PagoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.monto || !formData.concepto) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }
    
    const action = isEdit ? 'actualizado' : 'creado';
    Alert.alert('Éxito', `Pago ${action} correctamente`, [
      {
        text: 'OK',
        onPress: () => router.back()
      }
    ]);
    // Aquí iría la lógica para enviar los datos al backend
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Editar Pago' : 'Crear Nuevo Pago'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monto *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={formData.monto}
              onChangeText={(value) => handleInputChange('monto', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Concepto *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción del pago"
              value={formData.concepto}
              onChangeText={(value) => handleInputChange('concepto', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={formData.fecha}
              onChangeText={(value) => handleInputChange('fecha', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código de Referencia</Text>
            <TextInput
              style={styles.input}
              placeholder="Código único"
              value={formData.codigo}
              onChangeText={(value) => handleInputChange('codigo', value)}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isEdit ? 'Actualizar Pago' : 'Crear Pago'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8E6',
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
    fontWeight: '700',
    color: MAIN_COLOR,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // Para balancear el header
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: MAIN_COLOR,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8E6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: MAIN_COLOR,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});

export default CreateUpdatePago;
