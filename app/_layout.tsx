import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // No hacer navegación si aún está cargando
    if (isLoading) return;

    const inLogin = segments[0] === "login";

    // Usar requestAnimationFrame para asegurar que el componente esté montado
    const handleNavigation = () => {
      try {
        if (!user && !inLogin) {
          router.replace("/login");
        } else if (user && inLogin) {
          router.replace("/(tabs)/pagos");
        }
      } catch (error) {
        console.warn("Navigation error:", error);
      }
    };

    // Ejecutar en el próximo frame para asegurar que esté montado
    requestAnimationFrame(handleNavigation);
  }, [router, segments, user, isLoading]);

  // Mostrar pantalla de carga mientras se verifica el estado de autenticación
  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
