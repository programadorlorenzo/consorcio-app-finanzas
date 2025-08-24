import { MAIN_COLOR } from "@/app/constants";
import { stylesCustomSelectorCreatePago } from "@/styles/pagos/custom-selector-create-pago.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SelectorModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  formatDisplayText: (text: string) => string;
}

const SelectorModal: React.FC<SelectorModalProps> = ({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  formatDisplayText,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={stylesCustomSelectorCreatePago.modalOverlay}>
        <View style={stylesCustomSelectorCreatePago.modalContainer}>
          <View style={stylesCustomSelectorCreatePago.modalHeader}>
            <Text style={stylesCustomSelectorCreatePago.modalTitle}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={stylesCustomSelectorCreatePago.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={MAIN_COLOR} />
            </TouchableOpacity>
          </View>

          <ScrollView style={stylesCustomSelectorCreatePago.modalContent}>
            {options && options.length > 0 ? (
              options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    stylesCustomSelectorCreatePago.modalOption,
                    selectedValue === option &&
                      stylesCustomSelectorCreatePago.modalOptionSelected,
                  ]}
                  onPress={() => onSelect(option)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="ellipse" 
                    size={12} 
                    color={selectedValue === option ? MAIN_COLOR : "#8A9A97"} 
                  />
                  <Text
                    style={[
                      stylesCustomSelectorCreatePago.modalOptionText,
                      selectedValue === option &&
                        stylesCustomSelectorCreatePago.modalOptionTextSelected,
                    ]}
                  >
                    {formatDisplayText(option)}
                  </Text>
                  {selectedValue === option && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={MAIN_COLOR}
                      style={stylesCustomSelectorCreatePago.modalOptionIcon}
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={stylesCustomSelectorCreatePago.modalOption}>
                <Text style={stylesCustomSelectorCreatePago.modalOptionText}>
                  No hay opciones disponibles
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SelectorModal;
