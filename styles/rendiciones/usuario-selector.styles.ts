import { MAIN_COLOR } from "@/app/constants";
import { StyleSheet } from "react-native";

export const stylesUsuarioSelector = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: MAIN_COLOR,
  },

  selectorButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectorButtonActive: {
    borderColor: MAIN_COLOR,
    backgroundColor: '#fff',
  },

  selectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },

  selectorPlaceholder: {
    color: '#999',
  },

  chevronIcon: {
    marginLeft: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  modalHeader: {
    backgroundColor: MAIN_COLOR,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  closeButton: {
    padding: 4,
  },

  optionsList: {
    maxHeight: 300,
  },

  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionItemSelected: {
    backgroundColor: `${MAIN_COLOR}10`,
  },

  optionIcon: {
    marginRight: 12,
  },

  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },

  optionTextSelected: {
    color: MAIN_COLOR,
    fontWeight: '600',
  },

  optionSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  checkIcon: {
    marginLeft: 8,
  },

  emptyState: {
    padding: 40,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },

  // Selected user card
  selectedUserCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  userIconContainer: {
    marginRight: 16,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  userDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});
