import { MAIN_COLOR } from "@/app/constants";
import { stylesCustomSelectorCreateGasto } from "@/styles/gastos/custom-selector-create-update-gasto.styles";
import { formatDisplayText } from "@/utils/gastos/custom_selector_create_update_gasto.utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
}

const CustomSelectorCreateGasto = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  isVisible,
  onClose,
  keyExtractor,
  labelExtractor,
}: CustomSelectorCreatePagoProps) => {
  const getDisplayValue = () => {
    if (!value) return placeholder;
    const displayValue = labelExtractor ? labelExtractor(value) : value;
    return formatDisplayText(displayValue);
  };

  return (
    <>
      <TouchableOpacity
        style={stylesCustomSelectorCreateGasto.customSelector}
        onPress={() => !isVisible && onClose()}
      >
        <Text
          style={[
            stylesCustomSelectorCreateGasto.selectorText,
            !value && stylesCustomSelectorCreateGasto.selectorPlaceholder,
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

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={stylesCustomSelectorCreateGasto.modalOverlay}
          onPress={onClose}
        >
          <View style={stylesCustomSelectorCreateGasto.selectorModalContent}>
            <View style={stylesCustomSelectorCreateGasto.selectorModalHeader}>
              <Text style={stylesCustomSelectorCreateGasto.selectorModalTitle}>
                {label}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={MAIN_COLOR} />
              </TouchableOpacity>
            </View>

            <ScrollView style={stylesCustomSelectorCreateGasto.selectorOptions}>
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
                    style={stylesCustomSelectorCreateGasto.selectorOption}
                    onPress={() => {
                      onSelect(option);
                      onClose();
                    }}
                  >
                    <Text
                      style={[
                        stylesCustomSelectorCreateGasto.selectorOptionText,
                        isSelected &&
                          stylesCustomSelectorCreateGasto.selectorOptionSelected,
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

export default CustomSelectorCreateGasto;
