import { stylesBaseStylesCreatePago } from "@/styles/pagos/base-create-update-pago.styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ExpandableSectionProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  console.log(`🔧 ExpandableSection "${title}" renderizado - isExpanded: ${isExpanded}`);

  return (
    <View style={stylesBaseStylesCreatePago.expandableSection}>
      <TouchableOpacity
        style={stylesBaseStylesCreatePago.expandableHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={stylesBaseStylesCreatePago.expandableHeaderContent}>
          <Ionicons
            name={icon}
            size={20}
            color="#6B7280"
            style={stylesBaseStylesCreatePago.expandableIcon}
          />
          <View>
            <Text style={stylesBaseStylesCreatePago.expandableTitle}>
              {title}
            </Text>
            {subtitle && (
              <Text style={stylesBaseStylesCreatePago.expandableSubtitle}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={stylesBaseStylesCreatePago.expandableContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default ExpandableSection;
