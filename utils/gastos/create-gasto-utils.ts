import {
  CategoriaGasto,
  GastoCreateDto,
  SubCategoriaGasto,
} from "@/types/gastos/gastos.types";
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
  if (!type) return false;
  // Verificar tipo MIME completo
  if (type.startsWith("image/")) return true;
  // Verificar si es solo "image" (caso que estás viendo)
  if (type === "image") return true;
  // Verificar extensión como fallback
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => type.toLowerCase().includes(ext));
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getAvailableSubcategorias = (
  formData: GastoCreateDto
): SubCategoriaGasto[] => {
  if (!formData.categoria) return [];
  return CATEGORIA_SUBCATEGORIA_MAP[formData.categoria] || [];
};

export const addTemporaryFile = (
  file: any,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  // Priorizar mimeType si está disponible y es válido
  let fileType = file.mimeType || file.type || "unknown";
  
  // Si el tipo es solo "image", usar el mimeType si está disponible
  if (file.type === "image" && file.mimeType && file.mimeType.startsWith("image/")) {
    fileType = file.mimeType;
  }
  
  // Si no tiene tipo MIME, intentar determinarlo por extensión
  if (!fileType || fileType === "unknown") {
    const fileName = file.name || file.uri || "";
    if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      fileType = "image/jpeg"; // Tipo genérico para imágenes
    }
  }

  // Debug para verificar tipos
  console.log("File debug:", {
    name: file.name,
    type: file.type,
    mimeType: file.mimeType,
    finalType: fileType,
    isImage: isImage(fileType)
  });

  const newFile: FileItem = {
    uri: file.uri,
    name: file.name || `imagen_${Date.now()}.jpg`,
    type: fileType,
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
  CategoriaGasto,
  SubCategoriaGasto[]
> = {
  [CategoriaGasto.JOLG]: [
    SubCategoriaGasto.JOLG_LOCALES,
    SubCategoriaGasto.JOLG_PRODUCCION,
    SubCategoriaGasto.JOLG_PLANILLA,
  ],
  [CategoriaGasto.CORP_LORENZO]: [
    SubCategoriaGasto.CORP_LORENZO_LOCAL,
    SubCategoriaGasto.CORP_LORENZO_PRODUCCION,
    SubCategoriaGasto.CORP_LORENZO_PLANILLA,
  ],
  [CategoriaGasto.OSCAR_LORENZO]: [
    SubCategoriaGasto.OSCAR_LORENZO_PERSONAL,
    SubCategoriaGasto.OSCAR_LORENZO_CASA,
  ],
  [CategoriaGasto.CONSTRUCCIONES]: [
    SubCategoriaGasto.CONSTRUCCIONES_OBRAS,
    SubCategoriaGasto.CONSTRUCCIONES_HERRAMIENTAS,
  ],
  [CategoriaGasto.CASA]: [
    SubCategoriaGasto.CASA_SERVICIOS,
    SubCategoriaGasto.CASA_MANTENIMIENTO,
  ],
  [CategoriaGasto.OFICINA]: [
    SubCategoriaGasto.OFICINA_SERVICIOS,
    SubCategoriaGasto.OFICINA_SUMINISTROS,
  ],
  [CategoriaGasto.RENDICION]: [],
};
