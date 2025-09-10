import { MAIN_COLOR } from "@/app/constants";
import {
    Rendicion,
    getRendicionEstado,
} from "@/types/rendiciones/rendiciones.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BotonesAccionAdminRendicionProps {
  rendicion: Rendicion;
  onAprobar: () => void;
  onRechazar: () => void;
}

export default function BotonesAccionAdminRendicion({
  rendicion,
  onAprobar,
  onRechazar,
}: BotonesAccionAdminRendicionProps) {
  const estado = getRendicionEstado(rendicion);
  const puedeAprobarORechazar = estado === "ENVIADA";

  return (
    <View style={styles.actionSection}>
      {puedeAprobarORechazar && (
        <>
          <View style={styles.adminButtons}>
            <TouchableOpacity
              style={styles.rechazarButton}
              onPress={onRechazar}
            >
              <Ionicons name="close-circle" size={20} color="white" />
              <Text style={styles.rechazarButtonText}>Rechazar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.aprobarButton} onPress={onAprobar}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.aprobarButtonText}>Aprobar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {!puedeAprobarORechazar && (
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            {estado === "APROBADA"
              ? "Esta rendición ya ha sido aprobada"
              : estado === "DENEGADA"
              ? "Esta rendición ya ha sido rechazada"
              : "Esta rendición no está lista para revisión (debe estar ENVIADA)"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionSection: {
    paddingHorizontal: 20,
  },
  estadoInfo: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: MAIN_COLOR,
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  estadoText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 8,
    fontWeight: "500",
  },
  estadoValue: {
    fontWeight: "700",
    color: MAIN_COLOR,
  },
  accionesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  adminButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  rechazarButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rechazarButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  aprobarButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#10B981",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aprobarButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  warningText: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
    textAlign: "center",
  },
});
