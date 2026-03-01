import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
    label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  themeColor: any;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
  options,
  value,
  onChange,
  error,
  themeColor,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColor.inputBackground,
          borderColor: error ? themeColor.error : "#ccc",
        },
      ]}
    >
   <Text style={[styles.label,{color: themeColor.text}]}>{label}</Text>

      {options.map((item) => {
        const isSelected = value === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            style={styles.optionContainer}
            onPress={() => onChange(item.value)}
            activeOpacity={0.7}
          >
            {/* Outer Circle */}
            <View
              style={[
                styles.radioOuter,
                {
                  borderColor: isSelected
                    ? themeColor.tabBarActive
                    : themeColor.placeholder,
                },
              ]}
            >
              {/* Inner Circle */}
              {isSelected && (
                <View
                  style={[
                    styles.radioInner,
                    { backgroundColor: themeColor.tabBarActive },
                  ]}
                />
              )}
            </View>

            <Text
              style={[
                styles.label,
                { color: themeColor.text },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioGroup;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioOuter: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
  },
});