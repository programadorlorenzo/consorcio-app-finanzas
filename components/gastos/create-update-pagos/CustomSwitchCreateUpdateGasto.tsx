import { MAIN_COLOR } from "@/app/constants";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface CustomSwitchCreateUpdateGastoProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  leftLabel: string;
  rightLabel: string;
  disabled?: boolean;
}

const CustomSwitchCreateUpdateGasto = ({
  label,
  value,
  onValueChange,
  leftLabel,
  rightLabel,
  disabled = false,
}: CustomSwitchCreateUpdateGastoProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainLabel}>{label}</Text>
      <View style={styles.switchContainer}>
        <Text style={[styles.optionLabel, !value && styles.activeLabel]}>
          {leftLabel}
        </Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: MAIN_COLOR, true: MAIN_COLOR }}
          thumbColor={value ? "#fff" : "#fff"}
          ios_backgroundColor={MAIN_COLOR}
          onValueChange={onValueChange}
          value={value}
          disabled={disabled}
        />
        <Text style={[styles.optionLabel, value && styles.activeLabel]}>
          {rightLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  mainLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: MAIN_COLOR,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E8E6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  switch: {
    marginHorizontal: 12,
  },
  optionLabel: {
    fontSize: 14,
    color: "#8A9A97",
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  activeLabel: {
    color: MAIN_COLOR,
    fontWeight: "600",
  },
});

export default CustomSwitchCreateUpdateGasto;
