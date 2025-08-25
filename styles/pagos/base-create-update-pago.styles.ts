import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const stylesBaseStylesCreatePago = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gastoInfoContainer: {
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 16,
  },
  gastoInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MAIN_COLOR,
    marginBottom: 8,
  },
  gastoInfoDescription: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
  gastoInfoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gastoInfoCategory: {
    fontSize: 14,
    color: '#6c757d',
    flex: 1,
  },
  gastoInfoAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: MAIN_COLOR,
  },
  gastoSaldoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  gastoSaldoLabel: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  gastoSaldoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gastoEtiquetasContainer: {
    marginTop: 12,
  },
  gastoEtiquetasLabel: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 6,
  },
  gastoEtiquetasScroll: {
    flexDirection: 'row',
  },
  gastoEtiquetaBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
  },
  gastoEtiquetaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6c757d',
  },
  formContainer: {
    paddingVertical: 5,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  importeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  monedaSelector: {
    flex: 0.5,
  },
  importeInput: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 25,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  submitButton: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Estilos para el selector de bancos
  bancoSelectorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  bancoOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    width: "48%",
    minHeight: 56,
  },
  bancoOptionSelected: {
    backgroundColor: "#F8FAFC",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  bancoRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bancoRadioSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bancoBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  bancoText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Estilos para chips de banco (diseño compacto)
  bancoChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  bancoChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
    minHeight: 40,
  },
  bancoChipSelected: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  bancoChipIcon: {
    marginRight: 6,
  },
  bancoChipText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Estilos para banco selector horizontal con scroll
  bancoScrollView: {
    marginTop: 8,
    marginBottom: 8,
  },
  bancoScrollContent: {
    paddingHorizontal: 0,
    gap: 0,
  },
  bancoChipHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
    minHeight: 32,
    marginRight: 8,
  },
  bancoChipTextHorizontal: {
    fontSize: 11,
    fontWeight: "600",
    marginHorizontal: 4,
  },
  bancoCheckIcon: {
    marginLeft: 2,
  },

  // Estilos para secciones expandibles
  expandableSection: {
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  expandableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  expandableHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandableIcon: {
    marginRight: 12,
  },
  expandableTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  expandableSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  expandableContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  expandableContentHeader: {
    marginBottom: 16,
    paddingTop: 16,
  },

  // Estilos para información del proveedor en pagos
  proveedorInfoContainer: {
    backgroundColor: "#F8FAF9",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E1E8E6",
  },
  proveedorInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  proveedorInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  proveedorInfoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    width: 80,
  },
  proveedorInfoValue: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    marginLeft: 8,
  },

  // Estilos compactos para información del proveedor
  proveedorInfoCompacto: {
    marginTop: 8,
    paddingVertical: 4,
  },
  proveedorInfoTextoCompacto: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },
});
