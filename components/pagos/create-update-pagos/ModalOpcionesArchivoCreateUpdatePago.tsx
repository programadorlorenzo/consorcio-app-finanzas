import { MAIN_COLOR } from "@/app/constants";
import { stylesModalArchivosCreatePago } from "@/styles/pagos/modal-archivos-create-pago.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ModalOpcionesArchivoCreateUpdatePagoProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onDocument: () => void;
  disabled?: boolean;
}

const ModalOpcionesArchivoCreateUpdatePago: React.FC<ModalOpcionesArchivoCreateUpdatePagoProps> = ({
  visible,
  onClose,
  onCamera,
  onGallery,
  onDocument,
  disabled = false,
}) => {
  const handleOptionPress = (action: () => void) => {
    if (disabled) return; // No hacer nada si está deshabilitado
    action();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={stylesModalArchivosCreatePago.overlay}>
        <View style={stylesModalArchivosCreatePago.container}>
          <View style={stylesModalArchivosCreatePago.header}>
            <Text style={stylesModalArchivosCreatePago.title}>
              Agregar Archivo
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={stylesModalArchivosCreatePago.closeButton}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={stylesModalArchivosCreatePago.optionsContainer}>
            <TouchableOpacity
              style={[
                stylesModalArchivosCreatePago.option,
                disabled && stylesModalArchivosCreatePago.optionDisabled
              ]}
              onPress={() => handleOptionPress(onCamera)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              <View style={[
                stylesModalArchivosCreatePago.optionIcon,
                disabled && stylesModalArchivosCreatePago.optionIconDisabled
              ]}>
                <Ionicons 
                  name="camera" 
                  size={28} 
                  color={disabled ? "#9CA3AF" : MAIN_COLOR} 
                />
              </View>
              <View style={stylesModalArchivosCreatePago.optionContent}>
                <Text style={[
                  stylesModalArchivosCreatePago.optionTitle,
                  disabled && stylesModalArchivosCreatePago.optionTitleDisabled
                ]}>
                  Cámara
                </Text>
                <Text style={[
                  stylesModalArchivosCreatePago.optionDescription,
                  disabled && stylesModalArchivosCreatePago.optionDescriptionDisabled
                ]}>
                  {disabled ? "Procesando archivo..." : "Tomar foto del voucher o documento"}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={disabled ? "#D1D5DB" : "#9CA3AF"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                stylesModalArchivosCreatePago.option,
                disabled && stylesModalArchivosCreatePago.optionDisabled
              ]}
              onPress={() => handleOptionPress(onGallery)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              <View style={[
                stylesModalArchivosCreatePago.optionIcon,
                disabled && stylesModalArchivosCreatePago.optionIconDisabled
              ]}>
                <Ionicons 
                  name="images" 
                  size={28} 
                  color={disabled ? "#9CA3AF" : MAIN_COLOR} 
                />
              </View>
              <View style={stylesModalArchivosCreatePago.optionContent}>
                <Text style={[
                  stylesModalArchivosCreatePago.optionTitle,
                  disabled && stylesModalArchivosCreatePago.optionTitleDisabled
                ]}>
                  Galería
                </Text>
                <Text style={[
                  stylesModalArchivosCreatePago.optionDescription,
                  disabled && stylesModalArchivosCreatePago.optionDescriptionDisabled
                ]}>
                  {disabled ? "Procesando archivo..." : "Seleccionar desde la galería"}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={disabled ? "#D1D5DB" : "#9CA3AF"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                stylesModalArchivosCreatePago.option,
                disabled && stylesModalArchivosCreatePago.optionDisabled
              ]}
              onPress={() => handleOptionPress(onDocument)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              <View style={[
                stylesModalArchivosCreatePago.optionIcon,
                disabled && stylesModalArchivosCreatePago.optionIconDisabled
              ]}>
                <Ionicons 
                  name="document" 
                  size={28} 
                  color={disabled ? "#9CA3AF" : MAIN_COLOR} 
                />
              </View>
              <View style={stylesModalArchivosCreatePago.optionContent}>
                <Text style={[
                  stylesModalArchivosCreatePago.optionTitle,
                  disabled && stylesModalArchivosCreatePago.optionTitleDisabled
                ]}>
                  Documentos
                </Text>
                <Text style={[
                  stylesModalArchivosCreatePago.optionDescription,
                  disabled && stylesModalArchivosCreatePago.optionDescriptionDisabled
                ]}>
                  {disabled ? "Procesando archivo..." : "Seleccionar archivo PDF u otros"}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={disabled ? "#D1D5DB" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalOpcionesArchivoCreateUpdatePago;
