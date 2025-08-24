import { MAIN_COLOR } from "@/app/constants";
import ListGastosTodos from "@/components/gastos/ListGastosTodos";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ListGastosScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Header con botón de atrás */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Todos los Gastos</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ListGastosTodos />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40, // Same width as back button to center title
  },
});

export default ListGastosScreen;
