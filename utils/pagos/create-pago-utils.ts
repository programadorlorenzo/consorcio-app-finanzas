import {
  CategoriaPago,
  PaymentFormData,
  SubCategoriaPago,
} from "@/types/pagos/pagos.types";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export interface FileItem {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export const isImage = (type: string): boolean => {
  return type.startsWith("image/");
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getAvailableSubcategorias = (
  formData: PaymentFormData
): SubCategoriaPago[] => {
  if (!formData.categoria) return [];
  return CATEGORIA_SUBCATEGORIA_MAP[formData.categoria] || [];
};

export const addTemporaryFile = (
  file: any,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  const newFile: FileItem = {
    uri: file.uri,
    name: file.name || `archivo_${Date.now()}`,
    type: file.type || file.mimeType || "unknown",
    size: file.size,
  };
  setFiles((prev) => [...prev, newFile]);
};

export const pickFromGallery = async (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Error", "Se necesita permiso para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets) {
      result.assets.forEach((asset: any) => addTemporaryFile(asset, setFiles));
    }
  } catch (error) {
    console.error("Error accessing gallery:", error);
    Alert.alert("Error", "No se pudo abrir la galería");
  }
};

export const pickDocument = async (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!result.canceled && result.assets) {
      result.assets.forEach((asset: any) => addTemporaryFile(asset, setFiles));
    }
  } catch (error) {
    console.error("Error picking document:", error);
    Alert.alert("Error", "No se pudo seleccionar el documento");
  }
};

export const pickFromCamera = async (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Error", "Se necesita permiso para acceder a la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      result.assets.forEach((asset: any) => addTemporaryFile(asset, setFiles));
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    Alert.alert("Error", "No se pudo abrir la cámara");
  }
};

// Mapeo de categorías y subcategorías
export const CATEGORIA_SUBCATEGORIA_MAP: Record<
  CategoriaPago,
  SubCategoriaPago[]
> = {
  [CategoriaPago.JOLG]: [
    SubCategoriaPago.JOLG_LOCALES,
    SubCategoriaPago.JOLG_PRODUCCION,
    SubCategoriaPago.JOLG_PLANILLA,
  ],
  [CategoriaPago.CORP_LORENZO]: [
    SubCategoriaPago.CORP_LORENZO_LOCAL,
    SubCategoriaPago.CORP_LORENZO_PRODUCCION,
    SubCategoriaPago.CORP_LORENZO_PLANILLA,
  ],
  [CategoriaPago.OSCAR_LORENZO]: [
    SubCategoriaPago.OSCAR_LORENZO_PERSONAL,
    SubCategoriaPago.OSCAR_LORENZO_CASA,
  ],
  [CategoriaPago.CONSTRUCCIONES]: [
    SubCategoriaPago.CONSTRUCCIONES_OBRAS,
    SubCategoriaPago.CONSTRUCCIONES_HERRAMIENTAS,
  ],
  [CategoriaPago.CASA]: [
    SubCategoriaPago.CASA_SERVICIOS,
    SubCategoriaPago.CASA_MANTENIMIENTO,
  ],
  [CategoriaPago.OFICINA]: [
    SubCategoriaPago.OFICINA_SERVICIOS,
    SubCategoriaPago.OFICINA_SUMINISTROS,
  ],
  [CategoriaPago.RENDICION]: [],
};
