import { MAIN_COLOR } from "@/app/constants";
import {
    CategoriaGasto,
    GastoCreateDto,
    SubCategoriaGasto,
} from "@/types/gastos/gastos.types";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as WebBrowser from "expo-web-browser";
import { Alert, Platform } from "react-native";

export interface FileItem {
  uri: string;
  name: string;
  type: string;
  size?: number;
}
// Función para generar color basado en el nombre de la etiqueta
export const getBadgeColor = (nombre: string | null): string => {
  if (!nombre) return MAIN_COLOR;

  const colors = [
    "#D63031",
    "#00B894",
    "#0984E3",
    "#6C5CE7",
    "#FD79A8",
    "#E17055",
    "#00CEC9",
    "#A29BFE",
    "#74B9FF",
    "#FDCB6E",
    "#EE5A24",
    "#5F27CD",
    "#E84393",
    "#00D2D3",
    "#FF7675",
    "#2D3436",
    "#636E72",
    "#00B894",
    "#0984E3",
    "#6C5CE7",
  ];

  // Generar índice basado en el hash del nombre
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    const char = nombre.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return colors[Math.abs(hash) % colors.length];
};

export const isImage = (type: string): boolean => {
  if (!type) return false;
  // Verificar tipo MIME completo
  if (type.startsWith("image/")) return true;
  // Verificar si es solo "image" (caso que estás viendo)
  if (type === "image") return true;
  // Verificar extensión como fallback
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExtensions.some((ext) => type.toLowerCase().includes(ext));
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
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  prefix?: string
) => {
  // Para compatibilidad con diferentes tipos de picker
  let fileType = file.type || file.mimeType || "unknown";

  // Para archivos de DocumentPicker sin tipo
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
    isImage: isImage(fileType),
  });

  // Generar nombre del archivo con prefijo si se proporciona
  let fileName = file.name || `imagen_${Date.now()}.jpg`;
  if (prefix && !fileName.toLowerCase().includes(prefix.toLowerCase())) {
    const extension = fileName.split('.').pop();
    const baseName = fileName.replace(`.${extension}`, '');
    fileName = `${prefix}${baseName}.${extension}`;
  }

  const newFile: FileItem = {
    uri: file.uri,
    name: fileName,
    type: fileType,
    size: file.size,
  };

  setFiles((prev) => [...prev, newFile]);
};

export const pickFromGallery = async (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  prefix?: string
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
      result.assets.forEach((asset: any) => addTemporaryFile(asset, setFiles, prefix));
    }
  } catch (error) {
    console.error("Error accessing gallery:", error);
    Alert.alert("Error", "No se pudo abrir la galería");
  }
};

export const pickDocument = async (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  prefix?: string
) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!result.canceled && result.assets) {
      result.assets.forEach((asset: any) => addTemporaryFile(asset, setFiles, prefix));
    }
  } catch (error) {
    console.error("Error picking document:", error);
    Alert.alert("Error", "No se pudo seleccionar el documento");
  }
};

export const pickFromCamera = async (
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  prefix?: string
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
      result.assets.forEach((asset: any) => addTemporaryFile(asset, setFiles, prefix));
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
    SubCategoriaGasto.LOCALES,
    SubCategoriaGasto.PRODUCCION,
    SubCategoriaGasto.MATERIA_PRIMA,
  ],
  [CategoriaGasto.CORP_LORENZO]: [
    SubCategoriaGasto.LOCALES,
    SubCategoriaGasto.PRODUCCION,
  ],
  [CategoriaGasto.OSCAR_LORENZO]: [],
  [CategoriaGasto.CONSTRUCCIONES]: [],
  [CategoriaGasto.CASA]: [],
  [CategoriaGasto.OFICINA]: [],
  [CategoriaGasto.RENDICION]: [],
};

// Función auxiliar para obtener el ícono según el tipo de archivo
export const getFileIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  if (type.includes("pdf")) return "document-text-outline";
  if (type.includes("word") || type.includes("doc")) return "document-outline";
  if (type.includes("excel") || type.includes("sheet")) return "grid-outline";
  if (type.includes("powerpoint") || type.includes("presentation"))
    return "easel-outline";
  if (type.includes("zip") || type.includes("rar")) return "archive-outline";
  return "document-outline";
};

// Función para descargar archivos de manera elegante
export const downloadFile = async (url: string, filename: string) => {
  try {
    if (Platform.OS === "web") {
      // En web, simplemente abrir en nueva pestaña
      window.open(url, "_blank");
    } else {
      // En móvil, usar WebBrowser para abrir el archivo
      await WebBrowser.openBrowserAsync(url, {
        showTitle: true,
        toolbarColor: MAIN_COLOR,
        controlsColor: "#ffffff",
        enableBarCollapsing: false,
      });
    }
  } catch (error) {
    console.error("Error al descargar archivo:", error);
    Alert.alert(
      "Error",
      "No se pudo descargar el archivo. Inténtalo de nuevo."
    );
  }
};

// Función para truncar nombre de archivo elegantemente
export const truncateFileName = (
  fileName: string,
  maxLength: number = 15
): string => {
  // Remove everything to the left of the last "/" including the "/" itself
  if (fileName.includes("/")) {
    fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
  }

  if (fileName.length <= maxLength) return fileName;

  const extension = fileName.split(".").pop();
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));

  if (extension) {
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension.length - 4
    );
    return `${truncatedName}...${extension}`;
  }

  return fileName.substring(0, maxLength - 3) + "...";
};
