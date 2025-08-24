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
    paddingVertical: 16,
  },
  fieldContainer: {
    marginBottom: 0,
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
});
