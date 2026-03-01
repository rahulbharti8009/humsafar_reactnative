import React, { useEffect, useState } from "react";
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
import { getLoginData, getProfileData, getProfileExpData, setLoginSave, setProfileExpData } from "../../../utils/localDB";
import { ProfileEntity } from "../../../types/profile.type";
import { incomeList, occupationList } from "../../../utils/enum";
import { Dropdown } from "react-native-element-dropdown";
import { isValidEmail } from "../../../utils/helper";
import { postApi } from "../../../types/genericType";
import { ENDPOINT } from "../../../api/endpoint";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hook/hook";
import { login } from "../../../redux/slice/authSlice";
import BottomSheetDropdown from "../../../bottomSheet/BottomSheetDropdown";

export default function EducationDetails({ setCurrentStep, email }: any) {
    const { theme , themeColor} = useTheme();
    const dispatch = useDispatch();
        const user = useAppSelector(state => state.auth.user);
      
  const [form, setForm] = useState<ProfileEntity>({
    education: "",
    job: "",
    income: "",
    familyIncome: "",
  });
    const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [personal, setPersonal] = useState<any>({});

      useEffect(() => {
        const fetchData = async () => {
          await getProfileExpData().then(res => {
            if (res) {
              setForm(res);
            } 
          });
        };
        fetchData();

         const fetchPersonalData = async () => {
                await getProfileData().then(res => {
                  if (res) {
                    setPersonal(res);
                  } 
                });
              };
              fetchPersonalData();
      },[]);


  const validate = () => {
    let valid = true;
    let newErrors: any = {};

    if (!form.education) {
      newErrors.education = "Enter education";
      valid = false;
    }

    if (!form.job) {
      newErrors.job = "Enter occupation";
      valid = false;
    }

    if (!form.income) {
      newErrors.income = "Enter income";
      valid = false;
    }

    if (!form.familyIncome) {
      newErrors.familyIncome = "Enter family income";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

      const saveProfileApi = async () => {
        if (email.trim() === '' || !isValidEmail(email)) {
            Alert.alert("Validation Error", "Email shouldn't be empty and must be valid");
            return;
          }
          try {
              const payload: ProfileEntity = {
                email: user?.email, // use email from user state
                personal: personal,
                education: form.education,
                job: form.job,
                income: form.income,
                familyIncome: form.familyIncome
              };
                console.log(payload)

              // return
                setLoading(prev => prev = true)
                const res = await postApi<ProfileEntity, ProfileEntity>(
                  ENDPOINT.PROFILE.PROFILE_DETAILS,
                  payload 
                );
                    if(res.status) {
                        if (user != null) {
                          const updatedUser = { ...user, isProfileActive: true ,name : res.value?.personal?.name || user.name, mobile: res.value?.email || user.mobile};
                            await setLoginSave(updatedUser);
                            // dispatch(login(updatedUser));
                            setCurrentStep(3);
                            Alert.alert(`${res.message || "Profile saved successfully"}`);
                        } else {
                          Alert.alert("Error", "User data not found");
                        }
                    } else {
                      Alert.alert("Error", res.message);
                    }
              } catch (error) {
               console.log(  error);
                Alert.alert("Error", "Something went wrong");
              } finally {
              setLoading(false); 
             }
        };

  const onNext = () => {
    if (validate()) {

      setProfileExpData(form);
      saveProfileApi()
    }
  };


 const renderInput = (placeholder: string, key: keyof typeof form) => (<>
  {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
    <TextInput
      value={typeof form[key] === "string" || typeof form[key] === "undefined" ? form[key] as string : ""}
      placeholder={placeholder}
      placeholderTextColor={themeColor.placeholder}
      style={[styles.input,{backgroundColor: themeColor.inputBackground, color: themeColor.text}, errors[key] && { borderColor: themeColor.error}]}
      onChangeText={(v) => setForm({ ...form, [key]: v.toUpperCase() })}
    />
 </>

  );


  const renderBottomSheet = ({placeholder, key, data}: {placeholder: string; key: keyof typeof form; data?: any[]}) => (
     <BottomSheetDropdown
              label={placeholder}
              placeholder={`Select your ${placeholder.toLowerCase()}`}
              data={data || []}
              value={form[key]}
              onSelect={(value) => setForm({ ...form, [key]: value })}
            />
  )
  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:themeColor.background}]}>
      <View style={[styles.card,{backgroundColor:themeColor.inputBackground}]}>

        {renderInput("Highest Education", "education")}
            {errors.job && (
            <Text style={styles.error}>{errors.job}</Text>
          )}
  
        {renderBottomSheet({placeholder: "Occupation", key: "job", data: occupationList})}
        {renderBottomSheet({placeholder: "Income", key: "income", data: incomeList})}
        {renderBottomSheet({placeholder: "Family Income", key: "familyIncome", data: incomeList})}

        {errors.income && (
            <Text style={styles.error}>{errors.income}</Text>
          )}

          {errors.familyIncome && (
            <Text style={styles.error}>{errors.familyIncome}</Text>
          )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.previous}]} onPress={() => setCurrentStep(1)}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>

                <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.tabBarActive}]} onPress={onNext}>
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