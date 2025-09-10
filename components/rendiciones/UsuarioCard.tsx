import { MAIN_COLOR } from "@/app/constants";
import { stylesUsuarioSelector } from "@/styles/rendiciones/usuario-selector.styles";
import { Usuario } from "@/types/rendiciones/rendiciones.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface UsuarioCardProps {
  usuario: Usuario;
}

const UsuarioCard = ({ usuario }: UsuarioCardProps) => {
  return (
    <View style={stylesUsuarioSelector.selectedUserCard}>
      <View style={stylesUsuarioSelector.userIconContainer}>
        <Ionicons name="person-circle" size={60} color={MAIN_COLOR} />
      </View>
      
      <View style={stylesUsuarioSelector.userInfo}>
        <Text style={stylesUsuarioSelector.userName}>{usuario.nombre}</Text>
        <Text style={stylesUsuarioSelector.userDetail}>@{usuario.username}</Text>
        <Text style={stylesUsuarioSelector.userDetail}>{usuario.email}</Text>
      </View>
    </View>
  );
};

export default UsuarioCard;
