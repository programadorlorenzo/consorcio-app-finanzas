import { MAIN_COLOR } from "@/app/constants";
import { useAuth } from "@/components/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
              Alert.alert("Error", "No se pudo cerrar la sesión");
            }
          },
        },
      ]
    );
  };

  const ProfileOption = ({
    icon,
    title,
    onPress,
    showArrow = true,
    isDestructive = false,
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    showArrow?: boolean;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Ionicons
          name={icon as any}
          size={24}
          color={isDestructive ? "#EF4444" : MAIN_COLOR}
        />
        <Text
          style={[styles.optionText, isDestructive && styles.destructiveText]}
        >
          {title}
        </Text>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDestructive ? "#EF4444" : "#8A9A97"}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header del perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={MAIN_COLOR} />
          </View>
          <Text style={styles.userName}>{user?.nombre || "Usuario"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "email@ejemplo.com"}
          </Text>
        </View>

        {/* Información de la cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Usuario:</Text>
            <Text style={styles.infoValue}>{user?.username || "N/A"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text
              style={[
                styles.infoValue,
                user?.activo ? styles.activeStatus : styles.inactiveStatus,
              ]}
            >
              {user?.activo ? "Activo" : "Inactivo"}
            </Text>
          </View>

          {user?.lastPasswordChange && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Último cambio de contraseña:</Text>
              <Text style={styles.infoValue}>
                {new Date(user.lastPasswordChange).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Opciones del perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <ProfileOption
            icon="settings-outline"
            title="Configuración General"
            onPress={() =>
              Alert.alert(
                "Próximamente",
                "Esta función estará disponible pronto"
              )
            }
          />

          <ProfileOption
            icon="lock-closed-outline"
            title="Cambiar Contraseña"
            onPress={() =>
              Alert.alert(
                "Próximamente",
                "Esta función estará disponible pronto"
              )
            }
          />

          <ProfileOption
            icon="notifications-outline"
            title="Notificaciones"
            onPress={() =>
              Alert.alert(
                "Próximamente",
                "Esta función estará disponible pronto"
              )
            }
          />

          <ProfileOption
            icon="help-circle-outline"
            title="Ayuda y Soporte"
            onPress={() =>
              Alert.alert(
                "Próximamente",
                "Esta función estará disponible pronto"
              )
            }
          />
        </View>

        {/* Sección de cierre de sesión */}
        <View style={styles.section}>
          <ProfileOption
            icon="log-out-outline"
            title="Cerrar Sesión"
            onPress={handleSignOut}
            showArrow={false}
            isDestructive={true}
          />
        </View>

        {/* Información de la app */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Consorcio App Finanzas</Text>
          <Text style={styles.footerText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: MAIN_COLOR,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#8A9A97",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: MAIN_COLOR,
    backgroundColor: "#F0F7F5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8E6",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F7F5",
  },
  infoLabel: {
    fontSize: 16,
    color: "#8A9A97",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: MAIN_COLOR,
    fontWeight: "600",
  },
  activeStatus: {
    color: "#10B981",
  },
  inactiveStatus: {
    color: "#EF4444",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F7F5",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: MAIN_COLOR,
    fontWeight: "500",
    marginLeft: 15,
  },
  destructiveText: {
    color: "#EF4444",
  },
  footer: {
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#8A9A97",
    marginBottom: 5,
  },
});
