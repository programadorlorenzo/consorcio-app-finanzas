import LoginWaveCurve from "@/components/login/LoginWaveCurve";
import LoginWavePattern from "@/components/login/LoginWavePattern";
import LoginWhitePatterns from "@/components/login/LoginWhitePatterns";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { loginStyles } from "@/styles/login/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert(
        "Campos requeridos",
        "Por favor ingrese usuario y contraseña"
      );
      return;
    }

    setIsLoading(true);

    try {
      const ok = await signIn(username, password);

      if (ok) {
        console.log("Login exitoso");
        // Navigate to the main app screen or perform any post-login actions
        router.replace("/(tabs)/gastos");
      } else {
        Alert.alert(
          "Error de autenticación",
          "Las credenciales ingresadas no son válidas. Por favor intente nuevamente.",
          [{ text: "Entendido", style: "default" }]
        );
      }
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      Alert.alert(
        "Error de conexión",
        "No pudimos conectar con el servidor. Por favor verifique su conexión a internet."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Recuperación de contraseña",
      "Por favor comuníquese con el departamento de Sistemas para restablecer su contraseña.",
      [{ text: "Entendido", style: "default" }]
    );
  };

  return (
    <View style={loginStyles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={loginStyles.keyboardView}
      >
        {/* Wave pattern background - top section */}
        <View style={loginStyles.topSection}>
          <LoginWavePattern />
        </View>

        {/* Curva de transición */}
        <LoginWaveCurve color="#fff" />

        <View style={loginStyles.logoContainer}>
          <Image
            source={require("@/assets/images/logo_OL_2.png")}
            style={{
              width: 100,
              height: 90,
              position: "relative",
              marginBottom: 10,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Content container */}
        <View style={loginStyles.contentContainer}>
          <LoginWhitePatterns />

          <Animated.View
            entering={FadeInDown.duration(800).delay(200)}
            style={loginStyles.formContainer}
          >
            {/* Email field */}
            <View style={loginStyles.inputContainer}>
              <ThemedText style={loginStyles.inputLabel}>Usuario</ThemedText>
              <View style={loginStyles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#888"
                  style={loginStyles.inputIcon}
                />
                <TextInput
                  style={loginStyles.input}
                  placeholder="Ingrese su usuario"
                  placeholderTextColor="#aaa"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                />
              </View>
            </View>

            {/* Password field */}
            <View style={loginStyles.inputContainer}>
              <ThemedText style={loginStyles.inputLabel}>Contraseña</ThemedText>
              <View style={loginStyles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#888"
                  style={loginStyles.inputIcon}
                />
                <TextInput
                  style={loginStyles.input}
                  placeholder="Ingrese su contraseña"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={loginStyles.passwordToggle}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember me & Forgot password */}
            <View style={loginStyles.forgotContainer}>
              <TouchableOpacity
                style={loginStyles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <ThemedText style={loginStyles.forgotPasswordText}>
                  ¿Olvidó su contraseña?
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Login button */}
            <TouchableOpacity
              style={loginStyles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <ThemedText style={loginStyles.loginButtonText}>
                  Iniciar Sesión
                </ThemedText>
              )}
            </TouchableOpacity>

            {/* Company footer */}
            <View style={loginStyles.footer}>
              <ThemedText style={loginStyles.footerText}>
                Finanzas de la Corporación Lorenzo Beta ©{" "}
                {new Date().getFullYear()}
              </ThemedText>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
