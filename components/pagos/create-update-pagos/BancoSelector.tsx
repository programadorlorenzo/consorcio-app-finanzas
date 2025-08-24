import { stylesBaseStylesCreatePago } from "@/styles/pagos/base-create-update-pago.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export enum BancoOption {
  BCP = "BCP",
  INTERBANK = "INTERBANK",
  BBVA = "BBVA",
  SCOTIABANK = "SCOTIABANK",
  YAPE = "YAPE",
  PLIN = "PLIN",
  EFECTIVO = "EFECTIVO",
}

const BANCO_COLORS = {
  [BancoOption.BCP]: "#FF6B35",
  [BancoOption.INTERBANK]: "#00A651",
  [BancoOption.BBVA]: "#004481",
  [BancoOption.SCOTIABANK]: "#E31C23",
  [BancoOption.YAPE]: "#722F87",
  [BancoOption.PLIN]: "#652D90",
  [BancoOption.EFECTIVO]: "#16A34A",
};

const BANCO_ICONS: { [key in BancoOption]: keyof typeof Ionicons.glyphMap } = {
  [BancoOption.BCP]: "card-outline",
  [BancoOption.INTERBANK]: "card-outline",
  [BancoOption.BBVA]: "card-outline",
  [BancoOption.SCOTIABANK]: "card-outline",
  [BancoOption.YAPE]: "phone-portrait-outline",
  [BancoOption.PLIN]: "phone-portrait-outline",
  [BancoOption.EFECTIVO]: "cash-outline",
};

interface BancoSelectorProps {
  value?: string;
  onSelect: (banco: string | undefined) => void;
}

const BancoSelector: React.FC<BancoSelectorProps> = ({ value, onSelect }) => {
  const handleSelect = (banco: string) => {
    // Si el banco ya está seleccionado, lo deseleccionamos
    if (value === banco) {
      onSelect(undefined);
    } else {
      onSelect(banco);
    }
  };

  return (
    <View style={stylesBaseStylesCreatePago.fieldContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={stylesBaseStylesCreatePago.bancoScrollView}
        contentContainerStyle={stylesBaseStylesCreatePago.bancoScrollContent}
      >
        {Object.values(BancoOption).map((banco) => (
          <TouchableOpacity
            key={banco}
            style={[
              stylesBaseStylesCreatePago.bancoChipHorizontal,
              value === banco && stylesBaseStylesCreatePago.bancoChipSelected,
              {
                backgroundColor:
                  value === banco
                    ? BANCO_COLORS[banco]
                    : `${BANCO_COLORS[banco]}15`,
                borderColor: BANCO_COLORS[banco],
              },
            ]}
            onPress={() => handleSelect(banco)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={BANCO_ICONS[banco]}
              size={14}
              color={value === banco ? "#FFFFFF" : BANCO_COLORS[banco]}
              style={stylesBaseStylesCreatePago.bancoChipIcon}
            />
            <Text
              style={[
                stylesBaseStylesCreatePago.bancoChipTextHorizontal,
                {
                  color: value === banco ? "#FFFFFF" : BANCO_COLORS[banco],
                },
              ]}
            >
              {banco}
            </Text>
            {value === banco && (
              <Ionicons
                name="checkmark"
                size={12}
                color="#FFFFFF"
                style={stylesBaseStylesCreatePago.bancoCheckIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default BancoSelector;
