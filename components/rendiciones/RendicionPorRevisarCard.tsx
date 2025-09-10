import { MAIN_COLOR } from '@/app/constants';
import { Rendicion, getRendicionEstado } from '@/types/rendiciones/rendiciones.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RendicionPorRevisarCardProps {
  rendicion: Rendicion;
  onAprobar: () => void;
  onRechazar: () => void;
  onVerDetalle?: () => void;
}

export default function RendicionPorRevisarCard({ 
  rendicion, 
  onAprobar, 
  onRechazar,
  onVerDetalle
}: RendicionPorRevisarCardProps) {
  const estado = getRendicionEstado(rendicion);
  const tieneDetalles = rendicion.detalles && rendicion.detalles.length > 0;

  // Formatear fecha de envío
  const formatFechaEnvio = (fechaString?: string): string => {
    if (!fechaString) return 'Sin fecha';
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Calcular totales
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  const totalIniciado = formatCurrency(rendicion.total_iniciado);
  const totalRendido = formatCurrency(rendicion.total_rendido);
  const saldo = formatCurrency(rendicion.total_saldo);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.rendicionIdContainer}>
            <Text style={styles.rendicionId}>#{rendicion.id}</Text>
          </View>
          <View style={styles.rendicionInfo}>
            <Text style={styles.responsableName}>
              {rendicion.responsable?.nombre || 'Usuario sin nombre'}
            </Text>
            <Text style={styles.fechaEnvio}>
              Enviado: {formatFechaEnvio(rendicion.fecha_envio)}
            </Text>
          </View>
        </View>
        <View style={styles.estadoContainer}>
          <Text style={[styles.estado, { color: MAIN_COLOR }]}>
            {estado}
          </Text>
        </View>
      </View>

      {/* Resumen Financiero */}
      <View style={styles.resumenContainer}>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenLabel}>Total Iniciado:</Text>
          <Text style={styles.resumenValue}>S/ {totalIniciado}</Text>
        </View>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenLabel}>Total Rendido:</Text>
          <Text style={styles.resumenValue}>S/ {totalRendido}</Text>
        </View>
        <View style={[styles.resumenRow, styles.saldoRow]}>
          <Text style={styles.saldoLabel}>Saldo:</Text>
          <Text style={[
            styles.saldoValue, 
            { color: parseFloat(saldo) === 0 ? '#10B981' : '#F59E0B' }
          ]}>
            S/ {saldo}
          </Text>
        </View>
      </View>

      {/* Detalles */}
      {tieneDetalles && (
        <View style={styles.detallesContainer}>
          <View style={styles.detallesHeader}>
            <Ionicons name="list-outline" size={16} color="#6B7280" />
            <Text style={styles.detallesText}>
              {rendicion.detalles?.length} detalle{(rendicion.detalles?.length || 0) !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      {/* Botones de Acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.verDetallesButton}
          onPress={() => {
            if (onVerDetalle) {
              onVerDetalle();
            } else {
              Alert.alert(
                "Información",
                "La vista detallada no está disponible"
              );
            }
          }}
        >
          <Ionicons name="eye-outline" size={20} color={MAIN_COLOR} />
          <Text style={styles.verDetallesButtonText}>Ver Detalles</Text>
        </TouchableOpacity>

        <View style={styles.adminActions}>
          <TouchableOpacity 
            style={styles.rechazarButton}
            onPress={onRechazar}
          >
            <Ionicons name="close-circle" size={20} color="white" />
            <Text style={styles.rechazarButtonText}>Rechazar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.aprobarButton}
            onPress={onAprobar}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.aprobarButtonText}>Aprobar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: MAIN_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rendicionIdContainer: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  rendicionId: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  rendicionInfo: {
    flex: 1,
  },
  responsableName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  fechaEnvio: {
    fontSize: 14,
    color: '#6B7280',
  },
  estadoContainer: {
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  estado: {
    fontSize: 12,
    fontWeight: '600',
  },
  resumenContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saldoRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginBottom: 0,
  },
  resumenLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  resumenValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  saldoLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '700',
  },
  saldoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  detallesContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detallesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detallesText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 12,
  },
  verDetallesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MAIN_COLOR,
    backgroundColor: 'white',
  },
  verDetallesButtonText: {
    color: MAIN_COLOR,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rechazarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  rechazarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aprobarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  aprobarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
