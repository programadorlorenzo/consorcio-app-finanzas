import { Image } from "expo-image";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";

import { MAIN_COLOR } from "@/app/constants";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MAIN_COLOR} />

      {/* Background con degradado */}
      <View style={styles.gradientBackground} />

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Logo centrado */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo_OL_2.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        {/* Título y saludo */}
        <View style={styles.welcomeContainer}>
          <ThemedText style={styles.welcomeTitle}>
            Oscar Lorenzo Finanzas
          </ThemedText>
          <HelloWave />
        </View>

        {/* Subtítulo */}
        <ThemedText style={styles.subtitle}>
          Sistema de gestión de finanzas
        </ThemedText>

        {/* Indicadores de navegación */}
        <View style={styles.navigationHint}>
          <ThemedText style={styles.hintText}>
            Navega por las pestañas para gestionar gastos y pagos
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: MAIN_COLOR,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 80,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 5,
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    maxWidth: "80%",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 60,
    fontStyle: "italic",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  navigationHint: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  hintText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
