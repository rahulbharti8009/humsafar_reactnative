import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const NoDataFound = ({ title = "No Data Available", subtitle = "Pull to refresh" }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/ic_profile.png")}   // 👈 add your image
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>{title}</Text>
      {/* <Text style={styles.subtitle}>{subtitle}</Text> */}
    </View>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
    opacity: 0.9,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
});