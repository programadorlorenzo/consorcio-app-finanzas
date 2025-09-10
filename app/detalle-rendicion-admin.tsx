import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

// APIs
import { aprobarRendicion, rechazarRendicion } from '@/api/rendiciones/rendiciones-api';

// Types
import { Rendicion } from '@/types/rendiciones/rendiciones.types';

// Components
import BotonesAccionAdminRendicion from '@/components/rendiciones/BotonesAccionAdminRendicion';
import EstadoVacio from '@/components/rendiciones/EstadoVacio';
import ListaDetalles from '@/components/rendiciones/ListaDetalles';
import LoadingRendicion from '@/components/rendiciones/LoadingRendicion';
import RendicionHeader from '@/components/rendiciones/RendicionHeader';
import ResumenFinanciero from '@/components/rendiciones/ResumenFinanciero';

export default function DetalleRendicionAdminScreen() {
  const { rendicionId } = useLocalSearchParams();
  const [rendicion, setRendicion] = useState<Rendicion | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarRendicion = useCallback(async () => {
    try {
      setLoading(true);
      if (!rendicionId) return;

      // Aquí necesitaríamos un endpoint para obtener una rendición específica por ID
      // Por ahora simulamos la carga desde el backend
      console.log(`Cargando rendición ${rendicionId}`);
      
      // Temporal: en una implementación real tendríamos un endpoint específico
      // Por ahora vamos a mostrar un mensaje temporal
      throw new Error("Endpoint específico pendiente de implementar");
      
    } catch (error) {
      console.error("Error al cargar rendición:", error);
      Alert.alert("Error", "No se pudo cargar la rendición");
    } finally {
      setLoading(false);
    }
  }, [rendicionId]);

  useFocusEffect(
    useCallback(() => {
      cargarRendicion();
    }, [cargarRendicion])
  );

  const handleAprobar = async () => {
    if (!rendicion) return;

    Alert.alert(
      "Aprobar Rendición",
      "¿Estás seguro que deseas aprobar esta rendición?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aprobar",
          style: "default",
          onPress: async () => {
            try {
              setLoading(true);
              await aprobarRendicion(rendicion.id);
              Alert.alert(
                "Éxito", 
                "Rendición aprobada correctamente",
                [{ text: "OK", onPress: () => cargarRendicion() }]
              );
            } catch (error) {
              console.error("Error al aprobar rendición:", error);
              Alert.alert("Error", "No se pudo aprobar la rendición");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleRechazar = async () => {
    if (!rendicion) return;

    Alert.alert(
      "Rechazar Rendición",
      "¿Estás seguro que deseas rechazar esta rendición? El usuario tendrá que volver a crearla.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await rechazarRendicion(rendicion.id);
              Alert.alert(
                "Rendición Rechazada", 
                "La rendición ha sido rechazada. El usuario deberá crear una nueva.",
                [{ text: "OK", onPress: () => cargarRendicion() }]
              );
            } catch (error) {
              console.error("Error al rechazar rendición:", error);
              Alert.alert("Error", "No se pudo rechazar la rendición");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Estado de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <RendicionHeader title="Detalle de Rendición" />
        <LoadingRendicion message="Cargando rendición..." />
      </View>
    );
  }

  // Estado sin rendición
  if (!rendicion) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <RendicionHeader title="Detalle de Rendición" />
        <EstadoVacio 
          title="Error al cargar rendición"
          subtitle="No se pudo cargar la información de la rendición"
          icon="alert-circle-outline"
        />
      </View>
    );
  }

  // Rendición cargada
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RendicionHeader rendicion={rendicion} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}
      >
        <ResumenFinanciero rendicion={rendicion} />
        
        <BotonesAccionAdminRendicion 
          rendicion={rendicion}
          onAprobar={handleAprobar}
          onRechazar={handleRechazar}
        />
        
        <ListaDetalles detalles={rendicion.detalles || []} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
