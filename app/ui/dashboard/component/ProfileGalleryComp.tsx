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
import { getLoginData, getProfileData, getProfileExpData, setLoginSave, setProfileExpData } from "../../../utils/localDB";
import { ProfileEntity } from "../../../types/profile.type";
import { incomeList, occupationList } from "../../../utils/enum";
import { Dropdown } from "react-native-element-dropdown";
import { isValidEmail } from "../../../utils/helper";
import { postApi, uploadProfile } from "../../../types/genericType";
import { ENDPOINT } from "../../../api/endpoint";
import { MyCircle } from "../../../component/MyCircle";
import { Icon } from "../../../component/ImageComp";
import { openPicker } from "../../../utils/Camera";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slice/authSlice";

export default function ProfileGallery({ setCurrentStep, email, currentStep }: any) {
    const { theme , themeColor} = useTheme();
    const [image, setImage] = useState<string  | null>(null);
    const dispatch = useDispatch();

  const [form, setForm] = useState<ProfileEntity>({
    profileImages : [],
    gallery: [],
  });
    const [isLoading, setLoading] = useState<boolean>(false);

   const uoload =async () => {
         console.log("Form Data", form.profileImages[0]);
                         setLoading(() => true)
    try {
      const res =  await uploadProfile({
                     email: email,
                     profileImages: form.profileImages[0], 
                     galleryImages: form.gallery?.map((item) => item.uri) // ✅ FIXED
                   });
                 if(res.status) {
                   const updatedUser = await getLoginData();
                   dispatch(login(updatedUser));
                    Alert.alert("Profile uploaded successfully");
                  } else {
                    Alert.alert("Failed to upload profile");
                  }
                }catch(error) {
                  }
                  finally {
                    setLoading(() => false)
                  }
                 }
             

  return (
    <View style={[styles.container,{backgroundColor:themeColor.background}]}>
      <View style={[styles.card,{backgroundColor:themeColor.inputBackground}]}>
            <Text style={{color:themeColor.text, fontSize:18, fontWeight:"600", marginTop:10}}>Profile</Text>

              <MyCircle  size={60} color={themeColor.profileSelecter}>
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
                      size={40}
                      source={
                              form.profileImages && form.profileImages.length > 0
                                ? { uri: form.profileImages[0] }
                                : require("../../../../assets/ic_add.png")
                            }
                    />
              </TouchableOpacity>
               </MyCircle>

            <Text style={{color:themeColor.text, fontSize:18, fontWeight:"600", marginTop:10}}>Gallery</Text>
            <View style={{flexDirection:'row'}}>
{/* add galllary */}
              <MyCircle  size={60} color={themeColor.profileSelecter}>
              <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      openPicker({
                        imageType: "gallery",
                        callback: (_type: string, uri: string) => {
                          setForm((prev) => ({
                            ...prev,
                            gallery: [...(prev.gallery || []), { uri: uri }],
                          }));
                        },
                      })
                    }
                  >
                    <Icon
                      size={50}
                      tintColor={themeColor.placeholder}
                      source={
                             require("../../../../assets/ic_gallery.png")
                            }
                    />
              </TouchableOpacity>
               </MyCircle>
{/* gallary */}
                  {form.gallery?.map((item) => (
                                                <Icon
                                                style={{ marginLeft: 10 }}
                                                  key={item.uri}
                                                  size={50}
                                                  source={{ uri: item.uri }}
                                                />
                                              ))}
            </View>
{/* upload */}
           

      </View>
      {/* finish */}
      <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
              <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.previous}]} onPress={() => setCurrentStep(2)}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>

                   <TouchableOpacity disabled={form.profileImages?.length === 0 || form.gallery?.length === 0} style={[styles.button,{backgroundColor: form.profileImages?.length === 0 || form.gallery?.length === 0 ? themeColor.tabBarInactive : themeColor.tabBarActive}]} onPress={() => {
                  uoload();
                }}
                >
                <Text style={[styles.buttonText]}>Upload</Text>
                </TouchableOpacity>

      </View>
  </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    margin: 4,
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