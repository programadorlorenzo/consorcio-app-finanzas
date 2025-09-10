import { MAIN_COLOR } from '@/app/constants';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingRendicionProps {
  message?: string;
}

export default function LoadingRendicion({ 
  message = "Cargando rendición..." 
}: LoadingRendicionProps) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={MAIN_COLOR} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
