import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { IconSymbol } from "./IconSymbol";

const { width } = Dimensions.get("window");
const MAIN_COLOR = "#1D3935";

// Componente para el fondo curvo del tab bar
const CurvedBackground = () => {
  return (
    <View style={styles.curvedContainer}>
      <Svg width={width} height="100" viewBox={`0 0 ${width} 100`}>
        {/* Sombra principal */}
        <Path
          d={`M0,25 C${width * 0.25},5 ${
            width * 0.75
          },5 ${width},25 L${width},100 L0,100 Z`}
          fill="rgba(0,0,0,0.02)"
        />

        {/* Fondo principal con curva más pronunciada */}
        <Path
          d={`M0,20 C${width * 0.25},0 ${
            width * 0.75
          },0 ${width},20 L${width},100 L0,100 Z`}
          fill="#ffffff"
        />

        {/* Línea superior decorativa */}
        <Path
          d={`M0,20 C${width * 0.25},0 ${width * 0.75},0 ${width},20`}
          stroke="rgba(29, 57, 53, 0.1)"
          strokeWidth="1"
          fill="none"
        />

        {/* Gradiente sutil en la parte superior */}
        <Path
          d={`M0,18 C${width * 0.25},-2 ${
            width * 0.75
          },-2 ${width},18 L${width},22 C${width * 0.75},2 ${
            width * 0.25
          },2 0,22 Z`}
          fill="rgba(29, 57, 53, 0.03)"
        />
      </Svg>
    </View>
  );
};

// Componente para el tab central destacado
const CentralTab = ({
  focused,
  onPress,
  icon,
  label,
}: {
  focused: boolean;
  onPress: () => void;
  icon: any;
  label: string;
}) => {
  const scale = useSharedValue(focused ? 1.1 : 1);
  const translateY = useSharedValue(focused ? -10 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 15 });
    translateY.value = withSpring(focused ? -10 : 0, { damping: 15 });
  }, [focused, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.centralTabContainer, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.centralTab,
          {
            backgroundColor: focused ? MAIN_COLOR : "#f8f9fa",
            borderWidth: focused ? 0 : 2,
            borderColor: focused ? "transparent" : "#e9ecef",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <IconSymbol
          size={28}
          name={icon as any}
          color={focused ? "#fff" : "#6c757d"}
        />
      </TouchableOpacity>
      {focused && (
        <View style={styles.centralTabIndicator}>
          <Text style={styles.centralTabLabel}>{label}</Text>
        </View>
      )}
    </Animated.View>
  );
};

// Componente para tabs laterales
const SideTab = ({
  focused,
  onPress,
  icon,
  label,
  position = "left",
}: {
  focused: boolean;
  onPress: () => void;
  icon: any;
  label: string;
  position?: "left" | "right";
}) => {
  const scale = useSharedValue(focused ? 1.05 : 1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.05 : 1, { damping: 15 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.sideTabContainer, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.sideTab,
          {
            backgroundColor: focused ? "rgba(29, 57, 53, 0.08)" : "transparent",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <IconSymbol
          size={24}
          name={icon as any}
          color={focused ? MAIN_COLOR : "#8e9aaf"}
        />
        <Text
          style={[
            styles.sideTabLabel,
            { color: focused ? MAIN_COLOR : "#8e9aaf" },
          ]}
        >
          {label}
        </Text>
        {focused && <View style={styles.sideTabIndicator} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <CurvedBackground />

      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? (options.tabBarLabel as string)
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Configuración de iconos para cada tab
          const getTabIcon = (routeName: string) => {
            switch (routeName) {
              case "index":
                return "house.fill";
              case "profile":
                return "person.fill";
              case "gastos":
                return "paperplane.fill";
              case "settings":
                return "gear";
              case "notifications":
                return "bell.fill";
              default:
                return "house.fill";
            }
          };

          // Tab central (gastos)
          if (route.name === "gastos") {
            return (
              <CentralTab
                key={route.key}
                focused={isFocused}
                onPress={onPress}
                icon={getTabIcon(route.name)}
                label={label}
              />
            );
          }

          // Tabs laterales
          const position =
            index < state.routes.findIndex((r) => r.name === "gastos")
              ? "left"
              : "right";

          return (
            <SideTab
              key={route.key}
              focused={isFocused}
              onPress={onPress}
              icon={getTabIcon(route.name)}
              label={label}
              position={position}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
    paddingBottom: 20, // Espacio adicional para evitar chocar con la parte inferior
  },
  curvedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Cambio para distribuir mejor 5 tabs
    height: 100,
    paddingHorizontal: 15, // Reducido para dar más espacio a los tabs
    paddingBottom: 25, // Aumentado para mejor separación del borde
    paddingTop: 15,
  },
  centralTabContainer: {
    alignItems: "center",
    zIndex: 10,
    marginBottom: 20,
  },
  centralTab: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  centralTabIndicator: {
    position: "absolute",
    bottom: -15,
    alignItems: "center",
  },
  centralTabLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: MAIN_COLOR,
    marginTop: 6,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sideTabContainer: {
    alignItems: "center",
    flex: 0.8, // Reducido para dar más espacio al tab central
    paddingVertical: 8,
  },
  sideTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8, // Reducido para acomodar 5 tabs
    borderRadius: 16,
    minWidth: 50, // Reducido ligeramente
  },
  sideTabLabel: {
    fontSize: 10, // Reducido para mejor ajuste
    fontWeight: "600",
    marginTop: 3,
  },
  sideTabIndicator: {
    position: "absolute",
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: MAIN_COLOR,
  },
});
