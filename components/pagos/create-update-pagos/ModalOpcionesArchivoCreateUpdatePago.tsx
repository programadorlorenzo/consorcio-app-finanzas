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
}

const ModalOpcionesArchivoCreateUpdatePago: React.FC<ModalOpcionesArchivoCreateUpdatePagoProps> = ({
  visible,
  onClose,
  onCamera,
  onGallery,
  onDocument,
}) => {
  const handleOptionPress = (action: () => void) => {
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
              style={stylesModalArchivosCreatePago.option}
              onPress={() => handleOptionPress(onCamera)}
              activeOpacity={0.7}
            >
              <View style={stylesModalArchivosCreatePago.optionIcon}>
                <Ionicons name="camera" size={28} color={MAIN_COLOR} />
              </View>
              <View style={stylesModalArchivosCreatePago.optionContent}>
                <Text style={stylesModalArchivosCreatePago.optionTitle}>
                  Cámara
                </Text>
                <Text style={stylesModalArchivosCreatePago.optionDescription}>
                  Tomar foto del voucher o documento
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesModalArchivosCreatePago.option}
              onPress={() => handleOptionPress(onGallery)}
              activeOpacity={0.7}
            >
              <View style={stylesModalArchivosCreatePago.optionIcon}>
                <Ionicons name="images" size={28} color={MAIN_COLOR} />
              </View>
              <View style={stylesModalArchivosCreatePago.optionContent}>
                <Text style={stylesModalArchivosCreatePago.optionTitle}>
                  Galería
                </Text>
                <Text style={stylesModalArchivosCreatePago.optionDescription}>
                  Seleccionar desde la galería
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesModalArchivosCreatePago.option}
              onPress={() => handleOptionPress(onDocument)}
              activeOpacity={0.7}
            >
              <View style={stylesModalArchivosCreatePago.optionIcon}>
                <Ionicons name="document" size={28} color={MAIN_COLOR} />
              </View>
              <View style={stylesModalArchivosCreatePago.optionContent}>
                <Text style={stylesModalArchivosCreatePago.optionTitle}>
                  Documentos
                </Text>
                <Text style={stylesModalArchivosCreatePago.optionDescription}>
                  Seleccionar archivo PDF u otros
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalOpcionesArchivoCreateUpdatePago;
