import { MAIN_COLOR } from '@/app/constants';
import { Rendicion, getRendicionEstado } from '@/types/rendiciones/rendiciones.types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BotonesAccionRendicionProps {
  rendicion: Rendicion;
  onEnviarARevision: () => void;
}

export default function BotonesAccionRendicion({ 
  rendicion, 
  onEnviarARevision 
}: BotonesAccionRendicionProps) {
  const estado = getRendicionEstado(rendicion);
  const tieneDetalles = rendicion.detalles && rendicion.detalles.length > 0;
  const enProceso = estado === 'EN PROCESO';

  // Calcular saldo disponible
  const calcularSaldoDisponible = (): number => {
    const montoTotal = parseFloat(rendicion.total_iniciado?.toString() || '0');
    const totalDetalles = (rendicion.detalles || []).reduce((total, detalle) => {
      const importe = parseFloat(detalle.importeTotal?.toString() || '0');
      return total + (isNaN(importe) ? 0 : importe);
    }, 0);
    return montoTotal - totalDetalles;
  };

  const saldoDisponible = calcularSaldoDisponible();
  const saldoAgotado = saldoDisponible <= 0;

  return (
    <View style={styles.actionSection}>
      {/* Solo mostrar botón agregar si está en proceso */}
      {enProceso && (
        <>
          <TouchableOpacity 
            style={[
              styles.addDetailButton,
              saldoAgotado && styles.disabledButton
            ]}
            onPress={() => {
              if (saldoAgotado) {
                // Mostrar alerta cuando el saldo esté agotado
                return;
              }
              router.push('/create-detalle-rendicion' as any);
            }}
            disabled={saldoAgotado}
          >
            <Ionicons 
              name="add-circle" 
              size={24} 
              color={saldoAgotado ? "#9CA3AF" : "white"} 
            />
            <Text style={[
              styles.addDetailButtonText,
              saldoAgotado && styles.disabledButtonText
            ]}>
              {saldoAgotado ? 'Saldo Agotado' : 'Agregar Detalle'}
            </Text>
          </TouchableOpacity>
          
          {saldoAgotado && (
            <View style={styles.saldoWarning}>
              <Ionicons name="warning" size={16} color="#F59E0B" />
              <Text style={styles.saldoWarningText}>
                No puedes agregar más detalles. El saldo disponible es S/ {saldoDisponible.toFixed(2)}
              </Text>
            </View>
          )}
        </>
      )}

      {/* Botón enviar a revisión - solo si está en proceso y tiene detalles */}
      {enProceso && tieneDetalles && (
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={onEnviarARevision}
        >
          <Ionicons name="send" size={24} color="white" />
          <Text style={styles.submitButtonText}>Enviar a Revisión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  addDetailButton: {
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
  addDetailButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#10B981', // Verde para indicar acción positiva
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  saldoWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  saldoWarningText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
});
