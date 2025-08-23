import { PaymentStatusType } from "@/app/(tabs)/pagos";
import { MAIN_COLOR } from "@/app/constants";
import { menuCardStyles } from "@/styles/pagos/menu-card.styles";
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

const MenuCardPagos = ({
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
  statusType?: PaymentStatusType;
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
        menuCardStyles.card, 
        isAccent && menuCardStyles.accentCard,
        !isAccent && { backgroundColor }
      ]}
    >
      <View style={menuCardStyles.cardPattern}>
        <View style={menuCardStyles.cardContent}>
          <View
            style={[
              menuCardStyles.iconContainer,
              isAccent && menuCardStyles.accentIconContainer,
              !isAccent && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            ]}
          >
            <Ionicons
              name={icon}
              size={28}
              color={iconColor}
            />
          </View>
          <View style={menuCardStyles.textContainer}>
            <Text
              style={[
                menuCardStyles.cardTitle,
                isAccent && menuCardStyles.accentCardTitle,
                !isAccent && { color: textColor }
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                menuCardStyles.cardDescription,
                isAccent && menuCardStyles.accentCardDescription,
                !isAccent && { color: textColor, opacity: 0.8 }
              ]}
            >
              {description}
            </Text>
          </View>
          <View style={[
            menuCardStyles.chevronContainer,
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

export default MenuCardPagos;
