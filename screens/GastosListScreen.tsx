import { MAIN_COLOR } from '@/app/constants';
import ListGastosTodos from '@/components/gastos/ListGastosTodos';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function GastosScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAF9' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8E6',
        shadowColor: MAIN_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: MAIN_COLOR,
          textAlign: 'center',
        }}>
          Lista de Gastos
        </Text>
      </View>

      {/* Lista de gastos */}
      <ListGastosTodos />
    </SafeAreaView>
  );
}
