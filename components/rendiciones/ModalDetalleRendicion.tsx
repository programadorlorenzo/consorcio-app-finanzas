import { MAIN_COLOR } from "@/app/constants";
import {
    Rendicion,
    getRendicionEstado,
} from "@/types/rendiciones/rendiciones.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Alert,
    Animated,
    Clipboard,
    Dimensions,
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BotonesAccionAdminRendicion from "./BotonesAccionAdminRendicion";
import ListaDetalles from "./ListaDetalles";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9;

interface ModalDetalleRendicionProps {
  visible: boolean;
  rendicion: Rendicion | null;
  onClose: () => void;
  onAprobar?: () => void;
  onRechazar?: () => void;
  isAdmin?: boolean;
}

export default function ModalDetalleRendicion({
  visible,
  rendicion,
  onClose,
  onAprobar,
  onRechazar,
  isAdmin = false,
}: ModalDetalleRendicionProps) {
  const translateY = React.useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const [datosBancariosVisible, setDatosBancariosVisible] =
    React.useState(false);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: MODAL_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.dy > 0 && gestureState.dy > Math.abs(gestureState.dx);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > MODAL_HEIGHT * 0.2) {
        // Si arrastra más del 20% del modal, lo cierra
        Animated.timing(translateY, {
          toValue: MODAL_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        // Si no, lo regresa a su posición
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (!rendicion) return null;

  const estado = getRendicionEstado(rendicion);

  const formatFechaEnvio = (fechaString?: string): string => {
    if (!fechaString) return "Sin fecha";
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const copiarDatosBancarios = () => {
    let datos = "";
    if (rendicion?.banco) datos += `Banco: ${rendicion.banco}\n`;
    if (rendicion?.cuentabancaria)
      datos += `Cuenta: ${rendicion.cuentabancaria}\n`;
    if (rendicion?.cci) datos += `CCI: ${rendicion.cci}\n`;
    if (rendicion?.titular) datos += `Titular: ${rendicion.titular}\n`;
    if (rendicion?.formaPago)
      datos += `Forma de Pago: ${rendicion.formaPago.toUpperCase()}`;

    Clipboard.setString(datos);
    Alert.alert("Copiado", "Datos bancarios copiados al portapapeles");
  };

  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Handle para arrastrar */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Rendición #{rendicion.id}</Text>
              <Text style={styles.responsable}>
                {rendicion.responsable?.nombre || "Usuario sin nombre"}
              </Text>
              <Text style={styles.fecha}>
                Enviado: {formatFechaEnvio(rendicion.fecha_envio)}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Botones de acción para admin */}
          {isAdmin && onAprobar && onRechazar && (
            <View style={styles.buttonContainer}>
              <BotonesAccionAdminRendicion
                rendicion={rendicion}
                onAprobar={onAprobar}
                onRechazar={onRechazar}
              />
            </View>
          )}

          {/* Resumen Financiero Compacto */}
          <View style={styles.resumenCompacto}>
            <View style={styles.resumenRow}>
              <View style={styles.resumenItem}>
                <Text style={styles.resumenLabel}>Iniciado</Text>
                <Text style={styles.resumenValue}>
                  S/ {formatCurrency(rendicion.total_iniciado)}
                </Text>
              </View>
              <View style={styles.resumenItem}>
                <Text style={styles.resumenLabel}>Rendido</Text>
                <Text style={styles.resumenValue}>
                  S/ {formatCurrency(rendicion.total_rendido)}
                </Text>
              </View>
              <View style={styles.resumenItem}>
                <Text style={styles.resumenLabel}>Saldo</Text>
                <Text
                  style={[
                    styles.resumenValue,
                    {
                      color:
                        parseFloat(formatCurrency(rendicion.total_saldo)) === 0
                          ? "#10B981"
                          : "#F59E0B",
                    },
                  ]}
                >
                  S/ {formatCurrency(rendicion.total_saldo)}
                </Text>
              </View>
            </View>
          </View>

          {/* Contenido */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Lista de Detalles */}
            {rendicion.detalles && rendicion.detalles.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Detalles ({rendicion.detalles.length})
                </Text>
                <ListaDetalles detalles={rendicion.detalles} />
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    height: MODAL_HEIGHT,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  responsable: {
    fontSize: 16,
    color: MAIN_COLOR,
    fontWeight: "600",
    marginBottom: 2,
  },
  fecha: {
    fontSize: 14,
    color: "#6B7280",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  estadoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  estadoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estadoText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  datosContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  datoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  datoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  datoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "white",
  },
  // Nuevos estilos compactos
  resumenCompacto: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  resumenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumenItem: {
    alignItems: "center",
    flex: 1,
  },
  resumenLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  resumenValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  datosBancariosSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  datosBancariosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  datosBancariosHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  datosBancariosTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  datosBancariosHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  copyButton: {
    padding: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
  },
  datosBancariosContent: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  datoRowCompacto: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  datoLabelCompacto: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  datoValueCompacto: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "600",
  },
});
