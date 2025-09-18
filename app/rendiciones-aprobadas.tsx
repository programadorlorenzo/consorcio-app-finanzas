import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// APIs
import { obtenerRendicionesAprobadas } from '@/api/rendiciones/rendiciones-api';

// Types
import { Rendicion } from '@/types/rendiciones/rendiciones.types';

// Components
import EstadoVacio from '@/components/rendiciones/EstadoVacio';
import LoadingRendicion from '@/components/rendiciones/LoadingRendicion';
import ModalDetalleRendicion from '@/components/rendiciones/ModalDetalleRendicion';
import RendicionAprobadaCard from '@/components/rendiciones/RendicionAprobadaCard';
import RendicionHeader from '@/components/rendiciones/RendicionHeader';

export default function RendicionesAprobadasScreen() {
  const [rendiciones, setRendiciones] = useState<Rendicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [rendicionSeleccionada, setRendicionSeleccionada] = useState<Rendicion | null>(null);

  const cargarRendiciones = useCallback(async () => {
    try {
      setLoading(true);
      const rendicionesAprobadas = await obtenerRendicionesAprobadas();
      setRendiciones(rendicionesAprobadas);
    } catch (error) {
      console.error("Error al cargar rendiciones aprobadas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarRendiciones();
    }, [cargarRendiciones])
  );

  const handleVerDetalle = (rendicion: Rendicion) => {
    setRendicionSeleccionada(rendicion);
    setModalVisible(true);
  };

  const handleCerrarModal = () => {
    setModalVisible(false);
    setRendicionSeleccionada(null);
  };

  // Estado de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <RendicionHeader title="Rendiciones Aprobadas" />
        <LoadingRendicion message="Cargando rendiciones aprobadas..." />
      </View>
    );
  }

  // Estado sin rendiciones aprobadas
  if (rendiciones.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <RendicionHeader title="Rendiciones Aprobadas" />
        <EstadoVacio 
          title="No hay rendiciones aprobadas"
          subtitle="Aún no tienes rendiciones que hayan sido aprobadas"
          icon="checkmark-done-circle-outline"
        />
      </View>
    );
  }

  // Rendiciones aprobadas
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RendicionHeader title="Rendiciones Aprobadas" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}
      >
        <View style={styles.rendicionesContainer}>
          {rendiciones.map((rendicion) => (
            <RendicionAprobadaCard 
              key={rendicion.id}
              rendicion={rendicion}
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
        isAdmin={false} // Solo lectura, sin botones de aprobar/rechazar
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