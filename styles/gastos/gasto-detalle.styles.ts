import { MAIN_COLOR } from "@/app/constants";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const stylesGastoDetalle = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Wave background
  waveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 0,
  },
  wave: {
    position: "absolute",
    top: 0,
    left: -width,
    width: width * 2,
    height: 200,
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8A9A97",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#8A9A97",
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: MAIN_COLOR,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    zIndex: 10,
  },
  headerBackButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
    textAlign: "center",
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Menu
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  menuDropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 8,
    minWidth: 160,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuOptionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },

  // Content
  scrollView: {
    flex: 1,
  },

  // Card principal
  card: {
    marginHorizontal: 20,
    padding: 20,
    position: "relative",
  },

  // Estado indicator
  estadoIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // Código y estado
  codigoEstadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
    marginTop: 12,
  },
  codigoContainer: {
    flexDirection: "row",
  },
  codigoText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  estadoBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginLeft: 6,
  },

  // Breadcrumb
  breadcrumbContainer: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  breadcrumbText: {
    fontSize: 14,
    fontWeight: "600",
    color: MAIN_COLOR,
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: "#9CA3AF",
    marginHorizontal: 4,
  },
  breadcrumbSubText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Descripción y observaciones
  descripcion: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 24,
  },
  observaciones: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: "italic",
  },

  // Importe y saldo
  importeSaldoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  importeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  monedaText: {
    fontSize: 18,
    fontWeight: "600",
    color: MAIN_COLOR,
    marginRight: 4,
  },
  importeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
  },
  saldoContainer: {
    alignItems: "flex-end",
  },
  saldoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  saldoText: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Etiquetas
  etiquetasContainer: {
    marginBottom: 16,
  },
  etiquetasScroll: {
    marginTop: 8,
  },
  etiquetaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  etiquetaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },

  // Archivos
  archivosContainer: {
    marginBottom: 16,
  },
  archivosLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  archivosScroll: {
    marginTop: 4,
  },
  archivoItem: {
    marginRight: 12,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  archivoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
  },
  documentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  documentText: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    maxWidth: 70,
  },

  // Footer
  footerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  usuarioFechaContainer: {
    gap: 8,
  },
  usuarioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  creadorLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 8,
    fontWeight: "500",
  },
  fechaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  registradoLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginLeft: 6,
  },

  // Sección de pagos
  pagosSection: {
    margin: 16,
    marginTop: 0,
  },
  pagosSectionHeader: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pagosToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  pagosSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
    marginLeft: 12,
  },
  pagosContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },

  // Botón pagar
  pagarContainer: {
    margin: 16,
    marginTop: 0,
  },
  pagarButton: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pagarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  // Modal de imagen
  imageModalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  imageModalHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeModalButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  imageZoomScrollView: {
    flex: 1,
  },
  imageZoomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width,
    height: "100%",
  },

  // Pagos integrados dentro del card principal
  pagosIntegrados: {
    marginTop: 16,
  },
  pagosDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  pagosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 12,
  },
  pagosTitle: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginLeft: 8,
  },
  pagosListaContainer: {
    gap: 12,
  },
  pagoItemIntegrado: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // Estilos para información del proveedor
  proveedorContainer: {
    marginVertical: 12,
  },
  proveedorHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  proveedorText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    fontWeight: "500",
  },
});
