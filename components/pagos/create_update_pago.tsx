import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface PagoFormData {
  monto: string;
  concepto: string;
  fecha: string;
  codigo: string;
}

const CreateUpdatePago = () => {
  const [formData, setFormData] = useState<PagoFormData>({
    monto: '',
    concepto: '',
    fecha: '',
    codigo: '',
  });

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
    
    Alert.alert('Éxito', 'Pago creado correctamente');
    // Aquí iría la lógica para enviar los datos al backend
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#3494E6', '#EC6EAD']}
        style={styles.header}
      >
        <Ionicons name="card-outline" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Crear Nuevo Pago</Text>
      </LinearGradient>

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
            style={styles.input}
            placeholder="Descripción del pago"
            value={formData.concepto}
            onChangeText={(value) => handleInputChange('concepto', value)}
            multiline
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
          <LinearGradient
            colors={['#3494E6', '#EC6EAD']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Crear Pago</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
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
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CreateUpdatePago;