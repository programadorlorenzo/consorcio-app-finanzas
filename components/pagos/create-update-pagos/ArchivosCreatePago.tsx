import { FileItem, formatFileSize, isImage } from "@/utils/pagos/create-pago-utils";
import { Ionicons } from "@expo/vector-icons";

import { MAIN_COLOR } from "@/app/constants";
import { stylesBaseStylesCreatePago } from "@/styles/pagos/base-create-pago.styles";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface ListArchivosCreatePagoProps {
  files: FileItem[];
  removeFile: (index: number) => void;
}

const ListArchivosCreatePago = ({
  files,
  removeFile,
}: ListArchivosCreatePagoProps) => {
  return (
    <FlatList
      data={files}
      style={stylesBaseStylesCreatePago.filesList}
      renderItem={({ item, index }) => (
        <View style={stylesBaseStylesCreatePago.fileItem}>
          {isImage(item.type) ? (
            <Image
              source={{ uri: item.uri }}
              style={stylesBaseStylesCreatePago.fileImage}
            />
          ) : (
            <View style={stylesBaseStylesCreatePago.fileIcon}>
              <Ionicons name="document-outline" size={24} color={MAIN_COLOR} />
            </View>
          )}
          <View style={stylesBaseStylesCreatePago.fileInfo}>
            <Text style={stylesBaseStylesCreatePago.fileName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={stylesBaseStylesCreatePago.fileSize}>
              {formatFileSize(item.size)}
            </Text>
          </View>
          <TouchableOpacity
            style={stylesBaseStylesCreatePago.removeFileButton}
            onPress={() => removeFile(index)}
          >
            <Ionicons name="close-circle" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item, index) => `${item.uri}_${index}`}
      scrollEnabled={false}
    />
  );
};

export default ListArchivosCreatePago;
