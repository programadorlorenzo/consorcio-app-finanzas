import { isAxiosError } from "axios";
import { apiClient } from "../base-api";

export interface UploadFileResponse {
  filePath: string;
}

export interface FileToUpload {
  uri?: string; // Para React Native
  file?: File | Blob; // Para web
  fileName: string;
  type?: string;
}

export const uploadFile = async (fileData: FileToUpload): Promise<string> => {
  try {
    console.log("🚀 Subiendo archivo:", fileData.fileName);

    // Crear FormData para multipart/form-data
    const formData = new FormData();

    if (fileData.uri) {
      // React Native - usar URI
      formData.append("file", {
        uri: fileData.uri,
        name: fileData.fileName,
        type: fileData.type || "application/octet-stream",
      } as any);
    } else if (fileData.file) {
      // Web - usar File/Blob
      formData.append("file", fileData.file, fileData.fileName);
    } else {
      throw new Error("No se proporcionó archivo válido");
    }

    const response = await apiClient.put<string>("/files/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
    });

    console.log("✅ Archivo subido exitosamente:", response.data);
    return response.data; // Devuelve la ruta del archivo (ej: "files/1756010660234-688158677.pdf")
  } catch (error) {
    console.error("❌ Error uploading file:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error(
            "❌ Error de autenticación. Token inválido o expirado."
          );
        } else if (error.response.status === 413) {
          console.error("❌ Archivo demasiado grande");
        } else if (error.response.status === 415) {
          console.error("❌ Tipo de archivo no soportado");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

// Función auxiliar para subir múltiples archivos
export const uploadMultipleFiles = async (
  files: FileToUpload[]
): Promise<string[]> => {
  try {
    console.log("🚀 Subiendo múltiples archivos:", files.length);

    const uploadPromises = files.map((fileData) => uploadFile(fileData));
    const filePaths = await Promise.all(uploadPromises);

    console.log("✅ Todos los archivos subidos exitosamente:", filePaths);
    return filePaths;
  } catch (error) {
    console.error("❌ Error uploading multiple files:", error);
    throw error;
  }
};
