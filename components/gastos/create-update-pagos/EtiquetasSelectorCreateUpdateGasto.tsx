import { listarEtiquetas } from '@/api/etiquetas/etiquetas-api';
import { MAIN_COLOR } from '@/app/constants';
import { stylesEtiquetasSelector } from '@/styles/gastos/etiquetas-selector-create-update-gasto.styles';
import { Etiqueta } from '@/types/etiquetas/etiquetas.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface EtiquetasSelectorProps {
  selectedEtiquetasIds: number[];
  onEtiquetasChange: (etiquetasIds: number[]) => void;
  isVisible: boolean;
  onClose: () => void;
}

// Función para generar color basado en el nombre de la etiqueta
const getBadgeColor = (nombre: string | null): string => {
  if (!nombre) return MAIN_COLOR;
  
  const colors = [
    '#D63031', '#00B894', '#0984E3', '#6C5CE7', '#FD79A8',
    '#E17055', '#00CEC9', '#A29BFE', '#74B9FF', '#FDCB6E',
    '#EE5A24', '#5F27CD', '#E84393', '#00D2D3', '#FF7675',
    '#2D3436', '#636E72', '#00B894', '#0984E3', '#6C5CE7'
  ];
  
  // Generar índice basado en el hash del nombre
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    const char = nombre.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export default function EtiquetasSelectorCreateUpdateGasto({
  selectedEtiquetasIds,
  onEtiquetasChange,
  isVisible,
  onClose,
}: EtiquetasSelectorProps) {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [filteredEtiquetas, setFilteredEtiquetas] = useState<Etiqueta[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadEtiquetas();
  }, []);

  useEffect(() => {
    // Filtrar etiquetas por búsqueda
    if (searchText.trim() === '') {
      setFilteredEtiquetas(etiquetas);
    } else {
      const filtered = etiquetas.filter(etiqueta =>
        etiqueta.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
        etiqueta.descripcion?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEtiquetas(filtered);
    }
  }, [searchText, etiquetas]);

  const loadEtiquetas = async () => {
    try {
      setLoading(true);
      const data = await listarEtiquetas();
      setEtiquetas(data);
      setFilteredEtiquetas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las etiquetas');
      console.error('Error cargando etiquetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEtiqueta = (etiquetaId: number) => {
    const isSelected = selectedEtiquetasIds.includes(etiquetaId);
    let newSelectedIds: number[];

    if (isSelected) {
      // Remover etiqueta
      newSelectedIds = selectedEtiquetasIds.filter(id => id !== etiquetaId);
    } else {
      // Agregar etiqueta
      newSelectedIds = [...selectedEtiquetasIds, etiquetaId];
    }

    onEtiquetasChange(newSelectedIds);
  };

  const getSelectedEtiquetas = () => {
    return etiquetas.filter(etiqueta => selectedEtiquetasIds.includes(etiqueta.id));
  };

  const handleClose = () => {
    setSearchText('');
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const removeBadge = (etiquetaId: number) => {
    const newSelectedIds = selectedEtiquetasIds.filter(id => id !== etiquetaId);
    onEtiquetasChange(newSelectedIds);
  };

  return (
    <>
      {/* Badges Horizontales */}
      <View style={stylesEtiquetasSelector.badgesContainer}>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={stylesEtiquetasSelector.badgesScrollView}
          contentContainerStyle={stylesEtiquetasSelector.badgesScrollContent}
        >
          {/* Botón Más - Primero */}
          <TouchableOpacity
            style={stylesEtiquetasSelector.moreButton}
            onPress={handleOpenModal}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={MAIN_COLOR} />
          </TouchableOpacity>

          {/* Badges de etiquetas seleccionadas */}
          {getSelectedEtiquetas().map((etiqueta) => (
            <View 
              key={etiqueta.id} 
              style={[
                stylesEtiquetasSelector.badge,
                { backgroundColor: getBadgeColor(etiqueta.nombre) }
              ]}
            >
              <Text style={stylesEtiquetasSelector.badgeText}>
                {etiqueta.nombre}
              </Text>
              <TouchableOpacity
                style={stylesEtiquetasSelector.badgeRemoveButton}
                onPress={() => removeBadge(etiqueta.id)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Ionicons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modal para seleccionar más etiquetas */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={stylesEtiquetasSelector.modalContainer}>
          {/* Header del Modal */}
          <View style={stylesEtiquetasSelector.modalHeader}>
            <TouchableOpacity
              style={stylesEtiquetasSelector.closeButton}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={stylesEtiquetasSelector.modalTitle}>
              Seleccionar Etiquetas
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Campo de búsqueda */}
          <View style={stylesEtiquetasSelector.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={stylesEtiquetasSelector.searchInput}
              placeholder="Buscar etiquetas..."
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
            />
          </View>

          {/* Lista de etiquetas */}
          {loading ? (
            <View style={stylesEtiquetasSelector.loadingContainer}>
              <ActivityIndicator size="large" color={MAIN_COLOR} />
              <Text style={stylesEtiquetasSelector.loadingText}>
                Cargando etiquetas...
              </Text>
            </View>
          ) : (
            <ScrollView
              style={stylesEtiquetasSelector.etiquetasList}
              showsVerticalScrollIndicator={false}
            >
              {filteredEtiquetas.map((etiqueta) => (
                <TouchableOpacity
                  key={etiqueta.id}
                  style={stylesEtiquetasSelector.etiquetaItem}
                  onPress={() => toggleEtiqueta(etiqueta.id)}
                  activeOpacity={0.7}
                >
                  <View style={stylesEtiquetasSelector.etiquetaContent}>
                    <View style={stylesEtiquetasSelector.etiquetaInfo}>
                      <View 
                        style={[
                          stylesEtiquetasSelector.colorIndicator,
                          { backgroundColor: getBadgeColor(etiqueta.nombre) }
                        ]} 
                      />
                      <View style={stylesEtiquetasSelector.textContainer}>
                        <Text style={stylesEtiquetasSelector.etiquetaName}>
                          {etiqueta.nombre}
                        </Text>
                        {etiqueta.descripcion && (
                          <Text style={stylesEtiquetasSelector.etiquetaDescription}>
                            {etiqueta.descripcion}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={[
                      stylesEtiquetasSelector.checkbox,
                      selectedEtiquetasIds.includes(etiqueta.id) && stylesEtiquetasSelector.checkboxSelected
                    ]}>
                      {selectedEtiquetasIds.includes(etiqueta.id) && (
                        <Ionicons name="checkmark" size={18} color="white" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {filteredEtiquetas.length === 0 && searchText.trim() !== '' && (
                <View style={stylesEtiquetasSelector.emptyContainer}>
                  <Ionicons name="search" size={48} color="#ccc" />
                  <Text style={stylesEtiquetasSelector.emptyText}>
                    No se encontraron etiquetas que coincidan con &quot;{searchText}&quot;
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
}
