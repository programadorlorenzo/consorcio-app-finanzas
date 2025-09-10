import { DetalleRendicion } from '@/types/rendiciones/rendiciones.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DetalleCard from './DetalleCard';

interface ListaDetallesProps {
  detalles: DetalleRendicion[];
}

export default function ListaDetalles({ detalles }: ListaDetallesProps) {
  if (!detalles || detalles.length === 0) {
    return (
      <View style={styles.detailsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Detalles de Rendición</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </View>
        
        <View style={styles.emptyDetailsContainer}>
          <Ionicons name="document-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyDetailsTitle}>Sin detalles aún</Text>
          <Text style={styles.emptyDetailsText}>
            Comienza agregando tu primer detalle de rendición
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.detailsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Detalles de Rendición</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{detalles.length}</Text>
        </View>
      </View>
      
      {detalles.map((detalle, index) => (
        <DetalleCard 
          key={detalle.id} 
          detalle={detalle} 
          index={index} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyDetailsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDetailsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
