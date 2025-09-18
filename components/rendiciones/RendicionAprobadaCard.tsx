import { MAIN_COLOR } from '@/app/constants';
import { Rendicion, getRendicionEstado } from '@/types/rendiciones/rendiciones.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RendicionAprobadaCardProps {
  rendicion: Rendicion;
  onVerDetalle?: () => void;
}

export default function RendicionAprobadaCard({ 
  rendicion, 
  onVerDetalle
}: RendicionAprobadaCardProps) {
  // Formatear valores monetarios
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
  };

  // Formatear fecha de aprobación
  const formatFechaAprobada = (fecha: string): string => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const totalIniciado = formatCurrency(rendicion.total_iniciado);
  const totalRendido = formatCurrency(rendicion.total_rendido);
  const saldo = formatCurrency(rendicion.total_saldo);
  const estado = getRendicionEstado(rendicion);

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
            <Text style={styles.fechaAprobada}>
              Aprobada: {formatFechaAprobada(rendicion.fecha_aprobada!)}
            </Text>
          </View>
        </View>
        <View style={styles.estadoContainer}>
          <Text style={[styles.estado, { color: '#10B981' }]}>
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
          <Text style={styles.resumenLabel}>Saldo:</Text>
          <Text style={[styles.resumenValue, { 
            color: parseFloat(saldo) > 0 ? '#10B981' : parseFloat(saldo) < 0 ? '#EF4444' : '#6B7280'
          }]}>
            S/ {saldo}
          </Text>
        </View>
        
        {/* Cantidad de detalles */}
        {rendicion.detalles && rendicion.detalles.length > 0 && (
          <View style={styles.detallesInfo}>
            <Ionicons name="list-outline" size={16} color="#6B7280" />
            <Text style={styles.detallesText}>
              {rendicion.detalles?.length} detalle{(rendicion.detalles?.length || 0) !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Botón de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.verDetallesButton}
          onPress={() => {
            if (onVerDetalle) {
              onVerDetalle();
            }
          }}
        >
          <Ionicons name="eye-outline" size={20} color={MAIN_COLOR} />
          <Text style={styles.verDetallesButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
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
    borderLeftColor: '#10B981', // Verde para aprobadas
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
    backgroundColor: '#10B981',
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
  fechaAprobada: {
    fontSize: 14,
    color: '#6B7280',
  },
  estadoContainer: {
    backgroundColor: '#D1FAE5',
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
  detallesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detallesText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  verDetallesButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: MAIN_COLOR,
  },
  verDetallesButtonText: {
    color: MAIN_COLOR,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});