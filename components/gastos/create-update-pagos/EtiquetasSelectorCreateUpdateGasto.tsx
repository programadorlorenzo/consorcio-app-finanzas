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

  useEffect(() => {
    if (isVisible) {
      loadEtiquetas();
    }
  }, [isVisible]);

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

  const getSelectedEtiquetasNames = () => {
    return etiquetas
      .filter(etiqueta => selectedEtiquetasIds.includes(etiqueta.id))
      .map(etiqueta => etiqueta.nombre)
      .join(', ');
  };

  const handleClose = () => {
    setSearchText('');
    onClose();
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        style={stylesEtiquetasSelector.triggerButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <View style={stylesEtiquetasSelector.triggerContent}>
          <View style={stylesEtiquetasSelector.triggerTextContainer}>
            <Text style={stylesEtiquetasSelector.triggerLabel}>
              {selectedEtiquetasIds.length > 0 
                ? `${selectedEtiquetasIds.length} etiqueta${selectedEtiquetasIds.length > 1 ? 's' : ''} seleccionada${selectedEtiquetasIds.length > 1 ? 's' : ''}`
                : 'Seleccionar etiquetas'
              }
            </Text>
            {selectedEtiquetasIds.length > 0 && (
              <Text style={stylesEtiquetasSelector.selectedText} numberOfLines={2}>
                {getSelectedEtiquetasNames()}
              </Text>
            )}
          </View>
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={MAIN_COLOR} 
          />
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={stylesEtiquetasSelector.modalContainer}>
          {/* Header */}
          <View style={stylesEtiquetasSelector.modalHeader}>
            <TouchableOpacity 
              onPress={handleClose}
              style={stylesEtiquetasSelector.closeButton}
            >
              <Ionicons name="close" size={24} color={MAIN_COLOR} />
            </TouchableOpacity>
            <Text style={stylesEtiquetasSelector.modalTitle}>
              Seleccionar Etiquetas
            </Text>
            <View style={stylesEtiquetasSelector.placeholder} />
          </View>

          {/* Search Bar */}
          <View style={stylesEtiquetasSelector.searchContainer}>
            <Ionicons name="search" size={20} color="#8A9A97" />
            <TextInput
              style={stylesEtiquetasSelector.searchInput}
              placeholder="Buscar etiquetas..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#8A9A97"
            />
          </View>

          {/* Selected Count */}
          {selectedEtiquetasIds.length > 0 && (
            <View style={stylesEtiquetasSelector.selectedCountContainer}>
              <Text style={stylesEtiquetasSelector.selectedCountText}>
                {selectedEtiquetasIds.length} etiqueta{selectedEtiquetasIds.length > 1 ? 's' : ''} seleccionada{selectedEtiquetasIds.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}

          {/* Etiquetas List */}
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
              {filteredEtiquetas.length === 0 ? (
                <View style={stylesEtiquetasSelector.emptyContainer}>
                  <Ionicons name="pricetags-outline" size={48} color="#8A9A97" />
                  <Text style={stylesEtiquetasSelector.emptyText}>
                    {searchText ? 'No se encontraron etiquetas' : 'No hay etiquetas disponibles'}
                  </Text>
                </View>
              ) : (
                filteredEtiquetas.map((etiqueta) => {
                  const isSelected = selectedEtiquetasIds.includes(etiqueta.id);
                  
                  return (
                    <TouchableOpacity
                      key={etiqueta.id}
                      style={[
                        stylesEtiquetasSelector.etiquetaItem,
                        isSelected && stylesEtiquetasSelector.etiquetaItemSelected
                      ]}
                      onPress={() => toggleEtiqueta(etiqueta.id)}
                      activeOpacity={0.7}
                    >
                      <View style={stylesEtiquetasSelector.etiquetaContent}>
                        <View style={stylesEtiquetasSelector.etiquetaInfo}>
                          <Text style={[
                            stylesEtiquetasSelector.etiquetaName,
                            isSelected && stylesEtiquetasSelector.etiquetaNameSelected
                          ]}>
                            {etiqueta.nombre}
                          </Text>
                          {etiqueta.descripcion && (
                            <Text style={[
                              stylesEtiquetasSelector.etiquetaDescription,
                              isSelected && stylesEtiquetasSelector.etiquetaDescriptionSelected
                            ]}>
                              {etiqueta.descripcion}
                            </Text>
                          )}
                        </View>
                        <View style={[
                          stylesEtiquetasSelector.checkbox,
                          isSelected && stylesEtiquetasSelector.checkboxSelected
                        ]}>
                          {isSelected && (
                            <Ionicons name="checkmark" size={16} color="white" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={stylesEtiquetasSelector.modalFooter}>
            <TouchableOpacity
              style={stylesEtiquetasSelector.confirmButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={stylesEtiquetasSelector.confirmButtonText}>
                Confirmar Selección
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
