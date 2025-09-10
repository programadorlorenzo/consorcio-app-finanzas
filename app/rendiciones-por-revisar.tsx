import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

// APIs
import { aprobarRendicion, obtenerRendicionesPorRevisar, rechazarRendicion } from '@/api/rendiciones/rendiciones-api';

// Types
import { Rendicion } from '@/types/rendiciones/rendiciones.types';

// Components
import EstadoVacio from '@/components/rendiciones/EstadoVacio';
import LoadingRendicion from '@/components/rendiciones/LoadingRendicion';
import ModalDetalleRendicion from '@/components/rendiciones/ModalDetalleRendicion';
import RendicionHeader from '@/components/rendiciones/RendicionHeader';
import RendicionPorRevisarCard from '../components/rendiciones/RendicionPorRevisarCard';

export default function RendicionesPorRevisarScreen() {
  const [rendiciones, setRendiciones] = useState<Rendicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [rendicionSeleccionada, setRendicionSeleccionada] = useState<Rendicion | null>(null);

  const cargarRendiciones = useCallback(async () => {
    try {
      setLoading(true);
      const rendicionesPorRevisar = await obtenerRendicionesPorRevisar();
      setRendiciones(rendicionesPorRevisar);
    } catch (error) {
      console.error("Error al cargar rendiciones por revisar:", error);
      Alert.alert("Error", "No se pudieron cargar las rendiciones por revisar");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarRendiciones();
    }, [cargarRendiciones])
  );

  const handleAprobar = async (rendicionId: number) => {
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
              await aprobarRendicion(rendicionId);
              Alert.alert(
                "Éxito", 
                "Rendición aprobada correctamente",
                [{ text: "OK", onPress: () => cargarRendiciones() }]
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

  const handleRechazar = async (rendicionId: number) => {
    Alert.alert(
      "Rechazar Rendición",
      "¿Estás seguro que deseas rechazar esta rendición? Se reactivará para que el usuario pueda corregirla y reenviarla.",
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
              await rechazarRendicion(rendicionId);
              Alert.alert(
                "Rendición Rechazada", 
                "La rendición ha sido rechazada y reactivada. El usuario puede corregirla y reenviarla.",
                [{ text: "OK", onPress: () => cargarRendiciones() }]
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

  // Función para abrir el modal con una rendición específica
  const handleVerDetalle = (rendicion: Rendicion) => {
    setRendicionSeleccionada(rendicion);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCerrarModal = () => {
    setModalVisible(false);
    setRendicionSeleccionada(null);
  };

  // Función para aprobar desde el modal
  const handleAprobarDesdeModal = async () => {
    if (rendicionSeleccionada) {
      await handleAprobar(rendicionSeleccionada.id);
      handleCerrarModal();
    }
  };

  // Función para rechazar desde el modal
  const handleRechazarDesdeModal = async () => {
    if (rendicionSeleccionada) {
      await handleRechazar(rendicionSeleccionada.id);
      handleCerrarModal();
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <RendicionHeader title="Rendiciones por Revisar" />
        <LoadingRendicion message="Cargando rendiciones..." />
      </View>
    );
  }

  // Estado sin rendiciones por revisar
  if (rendiciones.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <RendicionHeader title="Rendiciones por Revisar" />
        <EstadoVacio 
          title="No hay rendiciones por revisar"
          subtitle="Todas las rendiciones han sido procesadas"
          icon="checkmark-done-circle-outline"
        />
      </View>
    );
  }

  // Rendiciones por revisar
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RendicionHeader title="Rendiciones por Revisar" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}
      >
        <View style={styles.rendicionesContainer}>
          {rendiciones.map((rendicion) => (
            <RendicionPorRevisarCard 
              key={rendicion.id}
              rendicion={rendicion}
              onAprobar={() => handleAprobar(rendicion.id)}
              onRechazar={() => handleRechazar(rendicion.id)}
              onVerDetalle={() => handleVerDetalle(rendicion)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Modal de Detalle */}
      <ModalDetalleRendicion
        visible={modalVisible}
        rendicion={rendicionSeleccionada}
        onClose={handleCerrarModal}
        onAprobar={handleAprobarDesdeModal}
        onRechazar={handleRechazarDesdeModal}
        isAdmin={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  rendicionesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
