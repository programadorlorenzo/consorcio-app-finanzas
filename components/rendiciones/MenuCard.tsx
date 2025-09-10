import { MAIN_COLOR } from "@/app/constants";
import { stylesMenuCardRendiciones } from "@/styles/rendiciones/menu-card.styles";
import { RendicionStatusType } from "@/types/rendiciones/rendiciones.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Colores para cada estado
const STATUS_COLORS = {
  default: MAIN_COLOR,
  accent: '#fff',
  pending: '#F59E0B', // Amarillo/Naranja para pendiente
  approved: '#10B981', // Verde para aprobado
  rejected: '#EF4444', // Rojo para rechazado
};

const MenuCardRendiciones = ({
  title,
  description,
  icon,
  onPress,
  statusType = 'default',
  disabled = false,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  statusType?: RendicionStatusType;
  disabled?: boolean;
}) => {
  const isAccent = statusType === 'accent';
  const backgroundColor = isAccent ? '#fff' : STATUS_COLORS[statusType];
  const textColor = disabled ? '#888' : (isAccent ? MAIN_COLOR : '#fff');
  const iconColor = disabled ? '#888' : (isAccent ? MAIN_COLOR : '#fff');
  
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      onPress={disabled ? undefined : onPress}
      style={[
        stylesMenuCardRendiciones.card, 
        isAccent && stylesMenuCardRendiciones.accentCard,
        !isAccent && { backgroundColor },
        disabled && stylesMenuCardRendiciones.disabledCard
      ]}
    >
      <View style={stylesMenuCardRendiciones.cardPattern}>
        <View style={stylesMenuCardRendiciones.cardContent}>
          <View
            style={[
              stylesMenuCardRendiciones.iconContainer,
              isAccent && stylesMenuCardRendiciones.accentIconContainer,
              !isAccent && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            ]}
          >
            <Ionicons
              name={icon}
              size={28}
              color={iconColor}
            />
          </View>
          <View style={stylesMenuCardRendiciones.textContainer}>
            <Text
              style={[
                stylesMenuCardRendiciones.cardTitle,
                isAccent && stylesMenuCardRendiciones.accentCardTitle,
                !isAccent && { color: textColor }
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                stylesMenuCardRendiciones.cardDescription,
                isAccent && stylesMenuCardRendiciones.accentCardDescription,
                !isAccent && { color: textColor, opacity: disabled ? 1 : 0.8 }
              ]}
            >
              {description}
            </Text>
          </View>
          <View style={[
            stylesMenuCardRendiciones.chevronContainer,
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

export default MenuCardRendiciones;
