import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Icon } from "./ImageComp";

export default function AppHeader({
  title,
  onMenuPress,
  onProfilePress,
}: any) {
      const { theme, toggleTheme, themeColor } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeColor.statusbar }]}>
      <StatusBar barStyle="light-content" />

      {/* LEFT ICON */}
      {/* <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={26} color="#fff" />
      </TouchableOpacity> */}

      {/* TITLE */}
      <Text style={styles.title}>{title}</Text>

      {/* RIGHT ICON */}
     <TouchableOpacity onPress={() => {
              toggleTheme();
              console.log('theme')}}>
            <View style={[{padding: 0,}]}>
                <Icon
                  source={theme === 'dark' ? require('../../assets/ic_dark_theme.png') : require('../../assets/ic_light_theme.png')}
                  size={30}
                  tintColor={theme === 'dark' ? themeColor.white: themeColor.black}
                /> 
              </View>
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