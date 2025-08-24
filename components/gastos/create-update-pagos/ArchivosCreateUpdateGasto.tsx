import {
  FileItem,
  formatFileSize,
  isImage,
} from "@/utils/gastos/create-gasto-utils";
import { Ionicons } from "@expo/vector-icons";

import { MAIN_COLOR } from "@/app/constants";
import { stylesBaseStylesCreateGasto } from "@/styles/gastos/base-create-update-gasto.styles";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface ListArchivosCreateGastoProps {
  files: FileItem[];
  removeFile: (index: number) => void;
}

const ListArchivosCreateGasto = ({
  files,
  removeFile,
}: ListArchivosCreateGastoProps) => {
  return (
    <FlatList
      data={files}
      style={stylesBaseStylesCreateGasto.filesList}
      renderItem={({ item, index }) => (
        <View style={stylesBaseStylesCreateGasto.fileItem}>
          {isImage(item.type) ? (
            <Image
              source={{ uri: item.uri }}
              style={stylesBaseStylesCreateGasto.fileImage}
            />
          ) : (
            <View style={stylesBaseStylesCreateGasto.fileIcon}>
              <Ionicons name="document-outline" size={24} color={MAIN_COLOR} />
            </View>
          )}
          <View style={stylesBaseStylesCreateGasto.fileInfo}>
            <Text
              style={stylesBaseStylesCreateGasto.fileName}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={stylesBaseStylesCreateGasto.fileSize}>
              {formatFileSize(item.size)}
            </Text>
          </View>
          <TouchableOpacity
            style={stylesBaseStylesCreateGasto.removeFileButton}
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

export default ListArchivosCreateGasto;
