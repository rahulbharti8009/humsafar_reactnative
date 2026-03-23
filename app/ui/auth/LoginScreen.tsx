import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";

import AnimatedInput from "../../component/AnimatedInput";
import AppButton from "../../component/AppButton";
import { RouteName } from "../../utils/enum";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { LoginPayload, User } from "../../types/auth";
import { postApi } from "../../types/genericType";
import { ENDPOINT } from "../../api/endpoint";
import { isValidEmail } from "../../utils/helper";
import { useTheme } from "../../theme/ThemeContext";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Login>;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const { themeColor } = useTheme();

  // ✅ Auto focus input
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Login API
  const onLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }

    try {
      setLoading(true);

      const payload: LoginPayload = {
        email: email.trim().toLowerCase(),
      };

      const res = await postApi<User, LoginPayload>(
        ENDPOINT.AUTH.LOGIN,
        payload
      );

      if (res.status) {
        navigation.navigate(RouteName.Otp, { email });
      } else {
        Alert.alert("Login Failed", res.message);
      }
    } catch (error) {
      console.log("Login Error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../../assets/ic_splash.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Dismiss keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.centerContainer}>
              <View style={styles.card}>

                <Text style={styles.text}>Welcome to Humsafar</Text>

                <AnimatedInput
                  ref={inputRef}
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  isTheme={false}
                  marginBottom={25}
                  cursorColor="#fff"
                  selectionColor="#fff"
                  placeholderTextColor="#333"
                />

                <AppButton
                  title="Login"
                  isLoading={isLoading}
                  onPress={onLogin}
                  disabled={!email || !isValidEmail(email)}
                />

              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },

  text: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#fff",
  },
});