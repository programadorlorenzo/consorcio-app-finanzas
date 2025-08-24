import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const stylesCustomSelectorCreatePago = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  selector: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  placeholder: {
    color: "#9CA3AF",
  },
  icon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
    textAlign: "center",
  },
  modalCloseButton: {
    position: "absolute",
    right: 0,
    top: -5,
    padding: 8,
  },
  modalContent: {
    flex: 1,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#F8FAF9",
  },
  modalOptionSelected: {
    backgroundColor: `${MAIN_COLOR}15`,
    borderWidth: 1,
    borderColor: `${MAIN_COLOR}40`,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN_COLOR,
    flex: 1,
  },
  modalOptionTextSelected: {
    color: MAIN_COLOR,
    fontWeight: "700",
  },
  modalOptionIcon: {
    marginLeft: 8,
  },
});
