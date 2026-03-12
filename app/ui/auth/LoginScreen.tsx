import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Animated,
  Text
} from "react-native";
import Video from "react-native-video";
import AnimatedInput from "../../component/AnimatedInput";
import { useTheme } from "../../theme/ThemeContext";
import AppButton from "../../component/AppButton";
import { RouteName } from "../../utils/enum";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { LoginPayload, User } from "../../types/auth";
import { postApi } from "../../types/genericType";
import { ENDPOINT } from "../../api/endpoint";
import { isValidEmail } from "../../utils/helper";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Login>;
};

const { width } = Dimensions.get("window");


export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("rahulbharti5822@gmail.com");
  const [isLoading, setLoading] = useState(false);
  const { theme , themeColor} = useTheme();

  const onLogin = async () => {
    if (email.trim() === "" || !isValidEmail(email)) {
      Alert.alert("Validation Error", "Email shouldn't be empty and must be valid");
      return;
    }

    try {
      const payload: LoginPayload = {
        email: email.trim().toLowerCase(),
      };

      setLoading(true);

      const res = await postApi<User, LoginPayload>(
        ENDPOINT.AUTH.LOGIN,
        payload
      );

      if (res.status) {
        navigation.navigate(RouteName.Otp, { email: email });
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* Background Video */}
      <Video
        source={require("../../../assets/video/splash_video.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        repeat={true}
        muted={true}
      />

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Login Content */}
      
      <View style={styles.container}>

        <AnimatedInput
          label="Email Address"
          placeholder="Email Address"
          value={email}
          isTheme={false}
          marginBottom={25}
          onChangeText={setEmail}
          cursorColor="#fff"
          selectionColor="#fff"
        />

        <AppButton
          title="Login"
          isLoading={isLoading}
          onPress={onLogin}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "10%",
    marginTop:'30%'
    // justifyContent: "center",
    // alignItems: "center",
  },
   text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom:'20%',
    color:'#fff'
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5,7,10,0.6)",
  },
});