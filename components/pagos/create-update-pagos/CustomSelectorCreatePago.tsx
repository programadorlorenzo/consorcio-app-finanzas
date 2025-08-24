import { stylesCustomSelectorCreatePago } from "@/styles/pagos/custom-selector-create-pago.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface CustomSelectorCreatePagoProps {
  label: string;
  value?: string;
  onPress: () => void;
  placeholder: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

const CustomSelectorCreatePago: React.FC<CustomSelectorCreatePagoProps> & {
  Modal: React.FC<ModalProps>;
} = ({
  label,
  value,
  onPress,
  placeholder,
  required = false,
  containerStyle,
}) => {
  return (
    <View style={[stylesCustomSelectorCreatePago.container, containerStyle]}>
      {label && (
        <Text style={stylesCustomSelectorCreatePago.label}>
          {label}
          {required && <Text style={stylesCustomSelectorCreatePago.required}> *</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={stylesCustomSelectorCreatePago.selector}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text
          style={[
            stylesCustomSelectorCreatePago.selectorText,
            !value && stylesCustomSelectorCreatePago.placeholder,
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color="#6B7280"
          style={stylesCustomSelectorCreatePago.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  formatDisplayText: (text: string) => string;
}

const CustomSelectorModal: React.FC<ModalProps> = ({
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
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView style={stylesCustomSelectorCreatePago.modalContent}>
            {options.map((option) => (
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
                    color="#10B981"
                    style={stylesCustomSelectorCreatePago.modalOptionIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

CustomSelectorCreatePago.Modal = CustomSelectorModal;

export default CustomSelectorCreatePago;
