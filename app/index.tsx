import { useAuth } from "@/components/providers/AuthProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // O un splash

  if (user) return <Redirect href="/(tabs)/pagos" />;
  return <Redirect href="/login" />;
}