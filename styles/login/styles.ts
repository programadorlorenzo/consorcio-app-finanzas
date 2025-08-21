import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  topSection: {
    height: "35%", // Reducido para subir el contenido
    backgroundColor: MAIN_COLOR, // Color corporativo principal
    position: "relative",
    overflow: "hidden",
  },
  waveCurveContainer: {
    height: 120,
    marginTop: -60,
    zIndex: 10,
  },
  curveSvg: {
    position: "absolute",
    top: 0,
  },
  wavePatternContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  waveSvg: {
    position: "absolute",
    bottom: 0,
  },
  circlesSvg: {
    position: "absolute",
    top: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  whitePatternContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none", // No interfiere con los toques
  },
  whitePatternSvg: {
    position: "absolute",
    top: 0, // Cambiado para que los patrones sean visibles
    left: 0,
    right: 0,
    bottom: 0,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparente con ligera opacidad
    marginHorizontal: 30,
    marginTop: 5, // Reducido para subir el formulario
    borderRadius: 20,
    padding: 25,
    paddingTop: 35, // Aumentado para evitar que el título se vea cortado
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 0,
  },
  title: {
    fontSize: 25, // Ajustado para evitar cortes
    fontWeight: "700",
    marginBottom: 20,
    color: "#1D3935", // Color corporativo
  },
  inputContainer: {
    marginBottom: 16, // Reducido para compactar el formulario
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#333",
  },
  passwordToggle: {
    paddingHorizontal: 16,
  },
  forgotContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20, // Reducido para compactar
  },
  forgotPassword: {
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: MAIN_COLOR, // Color corporativo
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: MAIN_COLOR, // Color corporativo
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 0, // Eliminado para subir el botón
    shadowColor: MAIN_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 25, // Reducido para compactar
  },
  footerText: {
    fontSize: 12,
    color: "#888",
  },
  footerVersion: {
    fontSize: 10,
    color: "#AAA",
    marginTop: 4,
  },
});
