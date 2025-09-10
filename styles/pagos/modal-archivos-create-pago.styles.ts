import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const stylesModalArchivosCreatePago = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
  },
  optionDisabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${MAIN_COLOR}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionIconDisabled: {
    backgroundColor: "#E5E7EB",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  optionTitleDisabled: {
    color: "#9CA3AF",
  },
  optionDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  optionDescriptionDisabled: {
    color: "#D1D5DB",
  },
});
