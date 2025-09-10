import { MAIN_COLOR } from '@/app/constants';
import { Rendicion, getRendicionEstado } from '@/types/rendiciones/rendiciones.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BotonesAccionAdminRendicionProps {
  rendicion: Rendicion;
  onAprobar: () => void;
  onRechazar: () => void;
}

export default function BotonesAccionAdminRendicion({ 
  rendicion, 
  onAprobar, 
  onRechazar 
}: BotonesAccionAdminRendicionProps) {
  const estado = getRendicionEstado(rendicion);
  const puedeAprobarORechazar = estado === 'ENVIADA';

  return (
    <View style={styles.actionSection}>
      <View style={styles.estadoInfo}>
        <View style={styles.estadoContainer}>
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={MAIN_COLOR} 
          />
          <Text style={styles.estadoText}>
            Estado actual: <Text style={styles.estadoValue}>{estado}</Text>
          </Text>
        </View>
      </View>

      {puedeAprobarORechazar && (
        <>
          <Text style={styles.accionesTitle}>Acciones Administrativas</Text>
          
          <View style={styles.adminButtons}>
            <TouchableOpacity 
              style={styles.rechazarButton}
              onPress={onRechazar}
            >
              <Ionicons name="close-circle" size={24} color="white" />
              <Text style={styles.rechazarButtonText}>Rechazar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.aprobarButton}
              onPress={onAprobar}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.aprobarButtonText}>Aprobar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={16} color="#F59E0B" />
            <Text style={styles.warningText}>
              Una vez aprobada o rechazada, esta acción no se puede deshacer
            </Text>
          </View>
        </>
      )}

      {!puedeAprobarORechazar && (
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            {estado === 'APROBADA' 
              ? 'Esta rendición ya ha sido aprobada'
              : estado === 'DENEGADA'
              ? 'Esta rendición ya ha sido rechazada'
              : 'Esta rendición no está lista para revisión (debe estar ENVIADA)'
            }
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  estadoInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: MAIN_COLOR,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estadoText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  estadoValue: {
    fontWeight: '700',
    color: MAIN_COLOR,
  },
  accionesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  adminButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  rechazarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aprobarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  warningText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
  },
});
