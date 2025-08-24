import { GastoStatusType } from "@/app/(tabs)/gastos";
import { MAIN_COLOR } from "@/app/constants";
import { stylesMenuCardGastos } from "@/styles/gastos/menu-card.styles-create-update-gasto";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Colores para cada estado
const STATUS_COLORS = {
  default: MAIN_COLOR,
  accent: '#fff',
  pending: '#F59E0B', // Amarillo/Naranja para pendiente
  completed: '#10B981', // Verde para completado
  rejected: '#EF4444', // Rojo para rechazado
};

const MenuCardGastos = ({
  title,
  description,
  icon,
  onPress,
  statusType = 'default',
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  statusType?: GastoStatusType;
}) => {
  const isAccent = statusType === 'accent';
  const backgroundColor = isAccent ? '#fff' : STATUS_COLORS[statusType];
  const textColor = isAccent ? MAIN_COLOR : '#fff';
  const iconColor = isAccent ? MAIN_COLOR : '#fff';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        stylesMenuCardGastos.card, 
        isAccent && stylesMenuCardGastos.accentCard,
        !isAccent && { backgroundColor }
      ]}
    >
      <View style={stylesMenuCardGastos.cardPattern}>
        <View style={stylesMenuCardGastos.cardContent}>
          <View
            style={[
              stylesMenuCardGastos.iconContainer,
              isAccent && stylesMenuCardGastos.accentIconContainer,
              !isAccent && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            ]}
          >
            <Ionicons
              name={icon}
              size={28}
              color={iconColor}
            />
          </View>
          <View style={stylesMenuCardGastos.textContainer}>
            <Text
              style={[
                stylesMenuCardGastos.cardTitle,
                isAccent && stylesMenuCardGastos.accentCardTitle,
                !isAccent && { color: textColor }
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                stylesMenuCardGastos.cardDescription,
                isAccent && stylesMenuCardGastos.accentCardDescription,
                !isAccent && { color: textColor, opacity: 0.8 }
              ]}
            >
              {description}
            </Text>
          </View>
          <View style={[
            stylesMenuCardGastos.chevronContainer,
            !isAccent && { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
          ]}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={iconColor}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuCardGastos;
