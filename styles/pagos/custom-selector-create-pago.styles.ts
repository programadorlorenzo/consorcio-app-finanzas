import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const stylesCustomSelectorCreatePago = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN_COLOR,
    marginBottom: 5,
  },
  required: {
    color: "#EF4444",
  },
  customSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 56,
  },
  selectorText: {
    fontSize: 16,
    color: MAIN_COLOR,
    flex: 1,
  },
  selectorPlaceholder: {
    color: "#8A9A97",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  selectorModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  selectorModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8E6",
  },
  selectorModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: MAIN_COLOR,
  },
  selectorOptions: {
    maxHeight: 400,
  },
  selectorOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F7F5",
  },
  selectorOptionText: {
    fontSize: 16,
    color: MAIN_COLOR,
    flex: 1,
  },
  selectorOptionSelected: {
    fontWeight: "600",
    color: MAIN_COLOR,
  },
});
