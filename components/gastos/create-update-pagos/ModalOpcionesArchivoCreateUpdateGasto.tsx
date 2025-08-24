import { MAIN_COLOR } from "@/app/constants";
import { stylesBaseStylesCreateGasto } from "@/styles/gastos/base-create-update-gasto.styles";
import {
  FileItem,
  pickDocument,
  pickFromCamera,
  pickFromGallery,
} from "@/utils/gastos/create-gasto-utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalOpcionesArchivoCreateUpdateGastoProps {
  showFileModal: boolean;
  setShowFileModal: (show: boolean) => void;
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

const ModalOpcionesArchivoCreateUpdateGasto: React.FC<
  ModalOpcionesArchivoCreateUpdateGastoProps
> = ({ showFileModal, setShowFileModal, setFiles }) => {
  return (
    <Modal
      visible={showFileModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFileModal(false)}
    >
      <TouchableOpacity
        style={stylesBaseStylesCreateGasto.modalOverlay}
        onPress={() => setShowFileModal(false)}
      >
        <View style={stylesBaseStylesCreateGasto.modalContent}>
          <Text style={stylesBaseStylesCreateGasto.modalTitle}>
            Seleccionar Archivo
          </Text>

          <TouchableOpacity
            style={stylesBaseStylesCreateGasto.modalOption}
            onPress={() => {
              setShowFileModal(false);
              pickFromCamera(setFiles);
            }}
          >
            <Ionicons name="camera" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreateGasto.modalOptionText}>
              Cámara
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesBaseStylesCreateGasto.modalOption}
            onPress={() => {
              setShowFileModal(false);
              pickFromGallery(setFiles);
            }}
          >
            <Ionicons name="image" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreateGasto.modalOptionText}>
              Galería
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesBaseStylesCreateGasto.modalOption}
            onPress={() => {
              setShowFileModal(false);
              pickDocument(setFiles);
            }}
          >
            <Ionicons name="document" size={24} color={MAIN_COLOR} />
            <Text style={stylesBaseStylesCreateGasto.modalOptionText}>
              Documentos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              stylesBaseStylesCreateGasto.modalOption,
              stylesBaseStylesCreateGasto.cancelOption,
            ]}
            onPress={() => setShowFileModal(false)}
          >
            <Text style={stylesBaseStylesCreateGasto.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalOpcionesArchivoCreateUpdateGasto;
