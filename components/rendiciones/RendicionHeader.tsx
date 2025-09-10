import { MAIN_COLOR } from '@/app/constants';
import { Rendicion, getRendicionEstado } from '@/types/rendiciones/rendiciones.types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RendicionHeaderProps {
  rendicion?: Rendicion | null;
  title?: string;
  showBackButton?: boolean;
}

export default function RendicionHeader({ 
  rendicion, 
  title = "Mi Rendición",
  showBackButton = true 
}: RendicionHeaderProps) {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
        {rendicion && (
          <Text style={styles.subtitle}>
            Estado: {getRendicionEstado(rendicion)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: MAIN_COLOR,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
