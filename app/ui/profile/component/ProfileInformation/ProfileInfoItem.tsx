import React from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {
  label: string;
  value?: string | number;
  icon?: string;
  color: string;
};

export const ProfileInfoItem = ({ label, value, icon, color }: Props) => {
  if (!value) return null;

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color }]}>
        {icon ? `${icon} ` : ""}{label}
      </Text>

      <Text style={[styles.value, { color }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    width: "45%",
  },

  value: {
    fontSize: 16,
    width: "55%",
    textAlign: "right",
  },
});