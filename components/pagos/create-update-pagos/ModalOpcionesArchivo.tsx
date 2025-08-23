import { MAIN_COLOR } from "@/app/constants";
import { stylesBaseStylesCreatePago } from "@/styles/pagos/base-create-pago.styles";
import {
    FileItem,
    pickDocument,
    pickFromCamera,
    pickFromGallery,
} from "@/utils/pagos/create-pago-utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalOpcionesArchivoCreateUpdatePagoProps {
  showFileModal: boolean;
  setShowFileModal: (show: boolean) => void;
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

const ModalOpcionesArchivoCreateUpdatePago: React.FC<ModalOpcionesArchivoCreateUpdatePagoProps> = ({
  showFileModal,
  setShowFileModal,
  setFiles,
}) => {
  return (
    <Modal
      visible={showFileModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFileModal(false)}
    >
      <TouchableOpacity
        style={stylesBaseStylesCreatePago.modalOverlay}
        onPress={() => setShowFileModal(false)}
      >
        <View style={stylesBaseStylesCreatePago.modalContent}>
          <Text style={stylesBaseStylesCreatePago.modalTitle}>
            Seleccionar Archivo
          </Text>

          <TouchableOpacity
            style={stylesBaseStylesCreatePago.modalOption}
            onPress={() => {
              setShowFileModal(false);
              pickFromCamera(setFiles);
            }}
          >
            <Ionicons name="camera" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreatePago.modalOptionText}>
              Cámara
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesBaseStylesCreatePago.modalOption}
            onPress={() => {
              setShowFileModal(false);
              pickFromGallery(setFiles);
            }}
          >
            <Ionicons name="image" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreatePago.modalOptionText}>
              Galería
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesBaseStylesCreatePago.modalOption}
            onPress={() => {
              setShowFileModal(false);
              pickDocument(setFiles);
            }}
          >
            <Ionicons name="document" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreatePago.modalOptionText}>
              Documentos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              stylesBaseStylesCreatePago.modalOption,
              stylesBaseStylesCreatePago.cancelOption,
            ]}
            onPress={() => setShowFileModal(false)}
          >
            <Text style={stylesBaseStylesCreatePago.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalOpcionesArchivoCreateUpdatePago;
