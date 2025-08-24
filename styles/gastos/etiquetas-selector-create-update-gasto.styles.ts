import { MAIN_COLOR } from '@/app/constants';
import { StyleSheet } from 'react-native';

export const stylesEtiquetasSelector = StyleSheet.create({
  // Trigger Button Styles
  triggerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8F0FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  triggerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 2,
  },
  selectedText: {
    fontSize: 14,
    color: '#8A9A97',
    lineHeight: 18,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
  },

  // Selected Count
  selectedCountContainer: {
    backgroundColor: '#E8F4FD',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: MAIN_COLOR,
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: MAIN_COLOR,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#8A9A97',
    marginTop: 12,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8A9A97',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },

  // Etiquetas List
  etiquetasList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  etiquetaItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F0F2F5',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  etiquetaItemSelected: {
    borderColor: MAIN_COLOR,
    backgroundColor: '#F8FBFF',
    shadowColor: MAIN_COLOR,
    shadowOpacity: 0.15,
    elevation: 3,
  },
  etiquetaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiquetaInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  etiquetaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  etiquetaNameSelected: {
    color: MAIN_COLOR,
  },
  etiquetaDescription: {
    fontSize: 14,
    color: '#8A9A97',
    lineHeight: 18,
  },
  etiquetaDescriptionSelected: {
    color: '#6B7280',
  },

  // Checkbox Styles
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxSelected: {
    backgroundColor: MAIN_COLOR,
    borderColor: MAIN_COLOR,
    shadowColor: MAIN_COLOR,
    shadowOpacity: 0.3,
  },

  // Footer Styles
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F7FA',
  },
  confirmButton: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Badge Styles
  badgesContainer: {
    paddingVertical: 12,
  },
  badgesScrollView: {
    maxHeight: 80,
  },
  badgesScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginRight: 6,
  },
  badgeRemoveButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBFF',
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 2,
    borderColor: MAIN_COLOR,
    borderStyle: 'dashed',
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: MAIN_COLOR,
    marginLeft: 6,
  },

  // Color indicator for modal items
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
  },
});
