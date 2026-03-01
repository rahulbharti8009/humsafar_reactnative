
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";

type Props = {
  currentStep: number;
};

const steps = ["Personal", "Education", "Profile Gallery"];

export default function Stepper({ currentStep }: Props) {
        const { theme , themeColor} = useTheme();
    
  return (
    <View style={[styles.container,{backgroundColor:themeColor.background}]}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;

        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,{backgroundColor: themeColor.profileSelecter},
                  isCompleted && styles.completed,
                  isActive && { backgroundColor: themeColor.tabBarActive },
                ]}
              >
                <Text style={[
                   {color: themeColor.text },
                  isCompleted && {color: themeColor.onlyWhite },
                  isActive && {color: themeColor.text},]}>{stepNumber}</Text>
              </View>
              <Text style={[styles.label,{color:themeColor.text}]}>{label}</Text>
            </View>

            {index !== steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  currentStep > stepNumber && styles.completedLine,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  stepContainer: {
    alignItems: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  completed: {
    backgroundColor: "#306432",
  },
  active: {
    backgroundColor: "#ff4d6d",
  },
  number: {
    color: "#fff",
    fontWeight: "700",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#444",
  },
  line: {
    width: 60,
    height: 3,
    backgroundColor: "#e0e0e0",
  },
  completedLine: {
    backgroundColor: "#4CAF50",
  },
});