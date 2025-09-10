import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

// Components
import BotonesAccionRendicion from "@/components/rendiciones/BotonesAccionRendicion";
import EstadoVacio from "@/components/rendiciones/EstadoVacio";
import ListaDetalles from "@/components/rendiciones/ListaDetalles";
import LoadingRendicion from "@/components/rendiciones/LoadingRendicion";
import RendicionHeader from "@/components/rendiciones/RendicionHeader";
import ResumenFinanciero from "@/components/rendiciones/ResumenFinanciero";

// APIs
import { obtenerDetallesPorRendicion } from "@/api/rendiciones/detalle-rendicion-api";
import {
  enviarRendicionARevision,
  obtenerRendicionActiva,
} from "@/api/rendiciones/rendiciones-api";

// Types
import { Rendicion } from "@/types/rendiciones/rendiciones.types";

// Utils

// Constants
const API_URL_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export default function MiRendicionScreen() {
  const [rendicionActiva, setRendicionActiva] = useState<Rendicion | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Estados para el modal de imágenes
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>("");

  // Función para abrir el modal de imagen
  const openImageModal = (uri: string) => {
    setSelectedImageUri(uri);
    setIsImageModalVisible(true);
  };

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
          style: "cancel",
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
          },
        },
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

      {/* Modal para visualizar imágenes */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <SafeAreaView style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={() => setIsImageModalVisible(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.imageModalContent}>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.imageModalImage}
              contentFit="contain"
              placeholder="📷"
              transition={200}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Estilos para la sección de archivos de rendición
  archivosRendicionSection: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  archivosRendicionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  archivosScroll: {
    flexDirection: "row",
  },
  archivoItem: {
    marginRight: 12,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  archivoImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imageOverlay: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  documentContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  documentText: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
    fontWeight: "500",
  },

  // Estilos para el modal de imágenes
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  imageModalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageModalImage: {
    width: "100%",
    height: "100%",
    maxWidth: 400,
    maxHeight: 600,
    borderRadius: 8,
  },
});
