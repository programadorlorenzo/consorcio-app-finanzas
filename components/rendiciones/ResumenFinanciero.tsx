import { Rendicion } from '@/types/rendiciones/rendiciones.types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ResumenFinancieroProps {
  rendicion: Rendicion;
}

export default function ResumenFinanciero({ rendicion }: ResumenFinancieroProps) {
  // Helper function para convertir valores a número y formatear
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Resumen Financiero</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Saldo Inicial</Text>
          <Text style={styles.summaryValuePositive}>
            S/ {formatCurrency(rendicion.total_iniciado)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Rendido</Text>
          <Text style={styles.summaryValueNeutral}>
            S/ {formatCurrency(rendicion.total_rendido)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Saldo Actual</Text>
          <Text style={[
            styles.summaryValue,
            parseFloat(formatCurrency(rendicion.total_saldo)) >= 0 
              ? styles.summaryValuePositive 
              : styles.summaryValueNegative
          ]}>
            S/ {formatCurrency(rendicion.total_saldo)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  summaryValuePositive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
  },
  summaryValueNeutral: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryValueNegative: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'center',
  },
});
