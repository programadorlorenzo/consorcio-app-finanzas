import { MAIN_COLOR } from '@/app/constants';
import { StyleSheet } from 'react-native';

export const stylesListGastos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8A9A97',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#8A9A97',
    textAlign: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },

  // Wave Patterns
  waveContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    overflow: 'hidden',
  },
  wave1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.3,
  },
  wave2: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },

  // Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 1,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estadoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  estadoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fechaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  // Descripción
  descripcion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
    lineHeight: 24,
  },

  // Categorías
  categoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  categoriaBadge: {
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  categoriaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  subcategoriaBadge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
  },
  subcategoriaText: {
    color: MAIN_COLOR,
    fontSize: 12,
    fontWeight: '500',
  },

  // Importe
  importeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  monedaText: {
    fontSize: 14,
    color: '#8A9A97',
    marginRight: 8,
  },
  importeText: {
    fontSize: 24,
    fontWeight: '700',
    color: MAIN_COLOR,
  },

  // Etiquetas
  etiquetasContainer: {
    marginBottom: 16,
  },
  etiquetasLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  etiquetasScroll: {
    flexDirection: 'row',
  },
  etiquetaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  etiquetaBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },

  // Archivos
  archivosContainer: {
    marginBottom: 16,
  },
  archivosLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  archivosScroll: {
    flexDirection: 'row',
  },
  archivoItem: {
    marginRight: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  archivoImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderTopLeftRadius: 8,
  },
  documentContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F8FBFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8F0FF',
  },
  documentText: {
    fontSize: 8,
    color: MAIN_COLOR,
    textAlign: 'center',
    marginTop: 2,
  },

  // Usuario
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usuarioText: {
    fontSize: 12,
    color: '#8A9A97',
    marginLeft: 6,
  },
  usuarioEstadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  usuarioFechaContainer: {
    flex: 1,
    marginRight: 12,
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  creadorLabel: {
    fontSize: 14,
    color: '#8A9A97',
    fontWeight: '500',
    fontStyle: 'italic',
    marginLeft: 4,
  },
  registradoLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    fontStyle: 'italic',
    marginLeft: 4,
  },

  // Footer reorganizado
  footerContainer: {
    marginTop: 5,
  },
  fechaEstadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estadoContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  estadoIndicatorSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  estadoTextSmall: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Tree Styles for Category/Subcategory
  treeContainer: {
    marginBottom: 10,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  treeLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    width: 20,
  },
  treeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MAIN_COLOR,
  },
  treeLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 4,
  },
  categoriaBadgeTree: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: MAIN_COLOR,
  },
  categoriaTextTree: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 6,
  },
  treeSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 4,
  },
  treeSubLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    width: 20,
    height: 20,
  },
  treeVerticalLine: {
    width: 1,
    height: 12,
    backgroundColor: '#E2E8F0',
    position: 'absolute',
    left: -12,
    top: -8,
  },
  treeCorner: {
    width: 8,
    height: 8,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    position: 'absolute',
    left: -12,
    bottom: 4,
  },
  treeHorizontalLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: -4,
  },
  subcategoriaBadgeTree: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#94A3B8',
  },
  subcategoriaTextTree: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 4,
  },
  
  // Horizontal Tree Styles
  treeHorizontalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  treeConnector: {
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modern Category/Subcategory Design
  categorySection: {
    marginVertical: 12,
  },
  categoryMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryTextNew: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    letterSpacing: 0.3,
  },
  subcategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryDivider: {
    width: 20,
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    position: 'relative',
  },
  subcategoryBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  subcategoryTextNew: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 6,
    letterSpacing: 0.2,
  },

  // Breadcrumb Styles
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    letterSpacing: 0.3,
  },
  breadcrumbSeparator: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  breadcrumbSubText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 0.2,
  },
});
