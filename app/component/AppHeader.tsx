import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function AppHeader({
  title,
  onMenuPress,
  onProfilePress,
}: any) {
      const { theme , themeColor} = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: themeColor.statusbar }]}>
      <StatusBar barStyle="light-content" />

      {/* LEFT ICON */}
      <TouchableOpacity onPress={onMenuPress}>
        {/* <Icon name="menu" size={26} color="#fff" /> */}
      </TouchableOpacity>

      {/* TITLE */}
      <Text style={styles.title}>{title}</Text>

      {/* RIGHT ICON */}
      <TouchableOpacity onPress={onProfilePress}>
        {/* <Icon name="person-circle-outline" size={30} color="#fff" /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 6,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});