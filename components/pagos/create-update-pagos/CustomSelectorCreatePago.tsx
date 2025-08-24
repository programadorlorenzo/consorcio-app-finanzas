import { MAIN_COLOR } from "@/app/constants";
import { stylesCustomSelectorCreatePago } from "@/styles/pagos/custom-selector-create-pago.styles";
import { formatDisplayText } from "@/utils/gastos/custom_selector_create_update_gasto.utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface CustomSelectorCreatePagoProps {
  label: string;
  value: any;
  placeholder: string;
  options: any[];
  onSelect: (value: any) => void;
  isVisible: boolean;
  onClose: () => void;
  keyExtractor?: (item: any) => string;
  labelExtractor?: (item: any) => string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

const CustomSelectorCreatePago = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  isVisible,
  onClose,
  keyExtractor,
  labelExtractor,
  containerStyle,
  required = false,
}: CustomSelectorCreatePagoProps) => {
  const getDisplayValue = () => {
    if (!value) return placeholder;
    const displayValue = labelExtractor ? labelExtractor(value) : value;
    return formatDisplayText(displayValue);
  };

  return (
    <>
      <View style={[stylesCustomSelectorCreatePago.container, containerStyle]}>
        {label && (
          <Text style={stylesCustomSelectorCreatePago.label}>
            {label}
            {required && <Text style={stylesCustomSelectorCreatePago.required}> *</Text>}
          </Text>
        )}
        <TouchableOpacity
          style={stylesCustomSelectorCreatePago.customSelector}
          onPress={() => !isVisible && onClose()}
        >
          <Text
            style={[
              stylesCustomSelectorCreatePago.selectorText,
              !value && stylesCustomSelectorCreatePago.selectorPlaceholder,
            ]}
          >
            {getDisplayValue()}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={!value ? "#8A9A97" : MAIN_COLOR}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={stylesCustomSelectorCreatePago.modalOverlay}
          onPress={onClose}
        >
          <View style={stylesCustomSelectorCreatePago.selectorModalContent}>
            <View style={stylesCustomSelectorCreatePago.selectorModalHeader}>
              <Text style={stylesCustomSelectorCreatePago.selectorModalTitle}>
                {label}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={MAIN_COLOR} />
              </TouchableOpacity>
            </View>

            <ScrollView style={stylesCustomSelectorCreatePago.selectorOptions}>
              {options.map((option) => {
                const key = keyExtractor ? keyExtractor(option) : option;
                const rawLabel = labelExtractor
                  ? labelExtractor(option)
                  : option;
                const formattedLabel = formatDisplayText(rawLabel);
                const isSelected = value === option;

                return (
                  <TouchableOpacity
                    key={key}
                    style={stylesCustomSelectorCreatePago.selectorOption}
                    onPress={() => {
                      onSelect(option);
                      onClose();
                    }}
                  >
                    <Text
                      style={[
                        stylesCustomSelectorCreatePago.selectorOptionText,
                        isSelected &&
                          stylesCustomSelectorCreatePago.selectorOptionSelected,
                      ]}
                    >
                      {formattedLabel}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={MAIN_COLOR} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default CustomSelectorCreatePago;
