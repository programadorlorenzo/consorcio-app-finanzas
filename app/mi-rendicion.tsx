import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

// APIs
import { obtenerDetallesPorRendicion } from '@/api/rendiciones/detalle-rendicion-api';
import { enviarRendicionARevision, obtenerRendicionActiva } from '@/api/rendiciones/rendiciones-api';

// Types
import { Rendicion } from '@/types/rendiciones/rendiciones.types';

// Components
import BotonesAccionRendicion from '@/components/rendiciones/BotonesAccionRendicion';
import EstadoVacio from '@/components/rendiciones/EstadoVacio';
import ListaDetalles from '@/components/rendiciones/ListaDetalles';
import LoadingRendicion from '@/components/rendiciones/LoadingRendicion';
import RendicionHeader from '@/components/rendiciones/RendicionHeader';
import ResumenFinanciero from '@/components/rendiciones/ResumenFinanciero';

export default function MiRendicionScreen() {
  const [rendicionActiva, setRendicionActiva] = useState<Rendicion | null>(null);
  const [loading, setLoading] = useState(true);

  const checkRendicionActiva = useCallback(async () => {
    try {
      setLoading(true);
      const rendicion = await obtenerRendicionActiva();
      
      if (rendicion) {
        // Obtener los detalles por separado usando la nueva API
        const detalles = await obtenerDetallesPorRendicion(rendicion.id);
        // Asignar los detalles a la rendición
        rendicion.detalles = detalles;
      }
      
      setRendicionActiva(rendicion);
    } catch (error) {
      console.error("Error al verificar rendición activa:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkRendicionActiva();
    }, [checkRendicionActiva])
  );

  const handleEnviarARevision = async () => {
    if (!rendicionActiva) return;

    // Validar que tenga detalles
    if (!rendicionActiva.detalles || rendicionActiva.detalles.length === 0) {
      Alert.alert(
        "No se puede enviar",
        "Debes agregar al menos un detalle antes de enviar a revisión"
      );
      return;
    }

    Alert.alert(
      "Enviar a Revisión",
      "¿Estás seguro que deseas enviar la rendición a revisión? Una vez enviada no podrás agregar más detalles.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Enviar",
          style: "default",
          onPress: async () => {
            try {
              setLoading(true);
              await enviarRendicionARevision(rendicionActiva.id);
              Alert.alert(
                "Éxito", 
                "Rendición enviada a revisión correctamente",
                [{ text: "OK", onPress: () => checkRendicionActiva() }]
              );
            } catch (error) {
              console.error("Error al enviar a revisión:", error);
              Alert.alert("Error", "No se pudo enviar la rendición a revisión");
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
        <RendicionHeader title="Mi Rendición" />
        <LoadingRendicion message="Cargando rendición..." />
      </View>
    );
  }

  // Estado sin rendición activa
  if (!rendicionActiva) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <RendicionHeader title="Mi Rendición" />
        <EstadoVacio />
      </View>
    );
  }

  // Rendición activa
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RendicionHeader rendicion={rendicionActiva} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}
      >
        <ResumenFinanciero rendicion={rendicionActiva} />
        
        <BotonesAccionRendicion 
          rendicion={rendicionActiva}
          onEnviarARevision={handleEnviarARevision}
        />
        
        <ListaDetalles detalles={rendicionActiva.detalles || []} />
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
