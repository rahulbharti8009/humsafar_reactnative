import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { getProfileData, getProfileExpData, setProfileExpData } from "../../../utils/localDB";
import { ProfileEntity } from "../../../types/profile.type";
import { incomeList, occupationList } from "../../../utils/enum";
import { Dropdown } from "react-native-element-dropdown";
import { isValidEmail } from "../../../utils/helper";
import { postApi, uploadProfile } from "../../../types/genericType";
import { ENDPOINT } from "../../../api/endpoint";
import { MyCircle } from "../../../component/MyCircle";
import { Icon } from "../../../component/ImageComp";
import { openPicker } from "../../../utils/Camera";

export default function ProfileGallery({ setCurrentStep, email }: any) {
    const { theme , themeColor} = useTheme();
    const [image, setImage] = useState<string  | null>(null);

  const [form, setForm] = useState<ProfileEntity>({
    profileImages : [],
    gallery: [],
  });
    const [isLoading, setLoading] = useState<boolean>(false);

  const onNext = async() => {
    console.log("Form Data", form.profileImages[0]);
      await uploadProfile({
                    email: email,
                    profileImages: form.profileImages[0], 
                  });
                };
  

  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:themeColor.background}]}>
      <View style={[styles.card,{backgroundColor:themeColor.inputBackground}]}>


              <MyCircle  size={85}>
              <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      openPicker({
                        imageType: "profile",
                        callback: (_type: string, uri: string) => {
                          setForm((prev) => ({
                            ...prev,
                            profileImages: [uri], // Assuming only one profile image
                          }));
                        },
                      })
                    }
                  >
                    <Icon
                      size={80}
                      source={
                              form.profileImages && form.profileImages.length > 0
                                ? { uri: form.profileImages[0] }
                                : require("../../../../assets/ic_profile.png")
                            }
                    />
              </TouchableOpacity>
               </MyCircle>

               

           <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.previous}]} onPress={() => {
            onNext();
           }}
          >
                <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
  


      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.previous}]} onPress={() => setCurrentStep(2)}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>

                <TouchableOpacity style={[styles.button]} onPress={onNext}>
                <Text style={[styles.buttonText]}>Next</Text>
              </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#f5f7fb",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#ff4d6d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#ff4d6d",
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
    dropdown: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },
});