import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { CustomTabBar } from "@/components/ui/CustomTabBar";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Config.",
        }}
      />
      <Tabs.Screen
        name="gastos"
        options={{
          title: "Gastos",
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notific.",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
        }}
      />
    </Tabs>
  );
}
