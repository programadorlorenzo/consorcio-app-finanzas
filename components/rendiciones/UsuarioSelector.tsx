import { MAIN_COLOR } from "@/app/constants";
import { stylesUsuarioSelector } from "@/styles/rendiciones/usuario-selector.styles";
import { Usuario } from "@/types/rendiciones/rendiciones.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface UsuarioSelectorProps {
  label: string;
  usuarios: Usuario[];
  selectedUsuario?: Usuario;
  onSelect: (usuario: Usuario) => void;
  placeholder?: string;
  loading?: boolean;
}

const UsuarioSelector = ({
  label,
  usuarios,
  selectedUsuario,
  onSelect,
  placeholder = "Seleccione un usuario...",
  loading = false
}: UsuarioSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (usuario: Usuario) => {
    onSelect(usuario);
    setIsModalVisible(false);
  };

  const getDisplayText = () => {
    if (selectedUsuario) {
      return `${selectedUsuario.nombre} (${selectedUsuario.username})`;
    }
    return placeholder;
  };

  return (
    <View style={stylesUsuarioSelector.container}>
      <Text style={stylesUsuarioSelector.label}>{label}</Text>
      
      <TouchableOpacity
        style={[
          stylesUsuarioSelector.selectorButton,
          selectedUsuario && stylesUsuarioSelector.selectorButtonActive
        ]}
        onPress={() => setIsModalVisible(true)}
        disabled={loading}
      >
        <Text
          style={[
            stylesUsuarioSelector.selectorText,
            !selectedUsuario && stylesUsuarioSelector.selectorPlaceholder,
          ]}
        >
          {getDisplayText()}
        </Text>
        
        {loading ? (
          <ActivityIndicator size="small" color={MAIN_COLOR} />
        ) : (
          <Ionicons
            name="chevron-down"
            size={20}
            color="#666"
            style={stylesUsuarioSelector.chevronIcon}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={stylesUsuarioSelector.modalOverlay}>
          <View style={stylesUsuarioSelector.modalContent}>
            {/* Header */}
            <View style={stylesUsuarioSelector.modalHeader}>
              <Text style={stylesUsuarioSelector.modalTitle}>
                Seleccionar Usuario
              </Text>
              <TouchableOpacity
                style={stylesUsuarioSelector.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <ScrollView style={stylesUsuarioSelector.optionsList}>
              {usuarios.length === 0 ? (
                <View style={stylesUsuarioSelector.emptyState}>
                  <Ionicons name="person-outline" size={48} color="#ccc" />
                  <Text style={stylesUsuarioSelector.emptyText}>
                    No hay usuarios rendidores disponibles
                  </Text>
                </View>
              ) : (
                usuarios.map((usuario) => {
                  const isSelected = selectedUsuario?.id === usuario.id;
                  
                  return (
                    <TouchableOpacity
                      key={usuario.id}
                      style={[
                        stylesUsuarioSelector.optionItem,
                        isSelected && stylesUsuarioSelector.optionItemSelected
                      ]}
                      onPress={() => handleSelect(usuario)}
                    >
                      <View style={stylesUsuarioSelector.optionIcon}>
                        <Ionicons
                          name="person-circle"
                          size={32}
                          color={isSelected ? MAIN_COLOR : '#666'}
                        />
                      </View>
                      
                      <View style={stylesUsuarioSelector.optionText}>
                        <Text
                          style={[
                            stylesUsuarioSelector.optionText,
                            isSelected && stylesUsuarioSelector.optionTextSelected
                          ]}
                        >
                          {usuario.nombre}
                        </Text>
                        <Text style={stylesUsuarioSelector.optionSubtext}>
                          @{usuario.username} • {usuario.email}
                        </Text>
                      </View>

                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={MAIN_COLOR}
                          style={stylesUsuarioSelector.checkIcon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsuarioSelector;
