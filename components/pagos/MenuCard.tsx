import { MAIN_COLOR } from "@/app/constants";
import { menuCardStyles } from "@/styles/pagos/menu-card.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const MenuCardPagos = ({
  title,
  description,
  icon,
  onPress,
  isAccent = false,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isAccent?: boolean;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[menuCardStyles.card, isAccent && menuCardStyles.accentCard]}
    >
      <View style={menuCardStyles.cardPattern}>
        <View style={menuCardStyles.cardContent}>
          <View
            style={[
              menuCardStyles.iconContainer,
              isAccent && menuCardStyles.accentIconContainer,
            ]}
          >
            <Ionicons
              name={icon}
              size={28}
              color={isAccent ? MAIN_COLOR : "#fff"}
            />
          </View>
          <View style={menuCardStyles.textContainer}>
            <Text
              style={[
                menuCardStyles.cardTitle,
                isAccent && menuCardStyles.accentCardTitle,
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                menuCardStyles.cardDescription,
                isAccent && menuCardStyles.accentCardDescription,
              ]}
            >
              {description}
            </Text>
          </View>
          <View style={menuCardStyles.chevronContainer}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isAccent ? MAIN_COLOR : "#fff"}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuCardPagos;
