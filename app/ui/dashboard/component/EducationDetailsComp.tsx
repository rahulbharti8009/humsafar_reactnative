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
import { getProfileData, getProfileExpData, setProfileExpData } from "../../../utils/localDB";
import { ProfileEntity } from "../../../types/profile.type";
import { incomeList, occupationList } from "../../../utils/enum";
import { Dropdown } from "react-native-element-dropdown";
import { isValidEmail } from "../../../utils/helper";
import { postApi } from "../../../types/genericType";
import { ENDPOINT } from "../../../api/endpoint";

export default function EducationDetails({ setCurrentStep, email }: any) {
    const { theme , themeColor} = useTheme();
  
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

      const onProfileApi = async () => {
        if (email.trim() === '' || !isValidEmail(email)) {
            Alert.alert("Validation Error", "Email shouldn't be empty and must be valid");
            return;
          }
          try {
              const payload: ProfileEntity = {
                email: email,
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
                      setCurrentStep(3);
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
      onProfileApi()
    }
  };


 const renderInput = (placeholder: string, key: keyof typeof form) => (<>
  {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
    <TextInput
      value={typeof form[key] === "string" || typeof form[key] === "undefined" ? form[key] as string : ""}
      placeholder={placeholder}
      placeholderTextColor={themeColor.placeholder}
      style={[styles.input,{backgroundColor: themeColor.inputBackground}, errors[key] && { borderColor: themeColor.error}]}
      onChangeText={(v) => setForm({ ...form, [key]: v })}
    />
 </>

  );



  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:themeColor.background}]}>
      <View style={[styles.card,{backgroundColor:themeColor.inputBackground}]}>

        {renderInput("Highest Education", "education")}
            {errors.job && (
            <Text style={styles.error}>{errors.job}</Text>
          )}
    <Dropdown
          style={[
            styles.dropdown,{backgroundColor: themeColor.inputBackground},
            errors.job && { borderColor:themeColor.error },
          ]}        
          data={occupationList}
          labelField="label"
          valueField="value"
          placeholder="Select Occupation"
          placeholderStyle={{ color: themeColor.placeholder }} 
          value={form.job}
          onChange={(item) => setForm({ ...form, job: item.value })}

          selectedTextStyle={{ color: themeColor.text, fontWeight: '600' }}
            /* 👇 DROPDOWN LIST STYLING */
          containerStyle={{
            backgroundColor: themeColor.inputBackground, // full dropdown bg
            borderRadius: 10,
          }}

          itemContainerStyle={{
            backgroundColor: themeColor.inputBackground, // male/female row bg
            borderRadius: 10,
          }}

          itemTextStyle={{
            color: themeColor.text,
          }}

         activeColor={themeColor.selectItem} // selected item bg
        />

        {errors.income && (
            <Text style={styles.error}>{errors.income}</Text>
          )}
               <Dropdown
                   style={[
                     styles.dropdown,{backgroundColor: themeColor.inputBackground},
                     errors.gender && { borderColor:themeColor.error },
                   ]}       
                  searchPlaceholder="Search income..."
                   search
                   data={incomeList}
                   labelField="label"
                   valueField="value"
                   placeholder="Select Income"
                   placeholderStyle={{ color: themeColor.placeholder }} 
                   value={form.income}
                   onChange={(item) => setForm({ ...form, income: item.value })}
         
                   selectedTextStyle={{ color: themeColor.text, fontWeight: '600' }}
                     /* 👇 DROPDOWN LIST STYLING */
                   containerStyle={{
                     backgroundColor: themeColor.inputBackground, // full dropdown bg
                     borderRadius: 10,
                   }}
         
                   itemContainerStyle={{
                     backgroundColor: themeColor.inputBackground, // male/female row bg
                     borderRadius: 10,
                   }}
         
                   itemTextStyle={{
                     color: themeColor.text,
                   }}
         
                  activeColor={themeColor.selectItem} // selected item bg
                 />



          {errors.familyIncome && (
            <Text style={styles.error}>{errors.familyIncome}</Text>
          )}
          <Dropdown
                   style={[
                     styles.dropdown,{backgroundColor: themeColor.inputBackground},
                     errors.gender && { borderColor:themeColor.error },
                   ]}       
                  searchPlaceholder="Search income..."
                   search
                   data={incomeList}
                   labelField="label"
                   valueField="value"
                   placeholder="Select Family Income"
                   placeholderStyle={{ color: themeColor.placeholder }} 
                   value={form.familyIncome}
                   onChange={(item) => setForm({ ...form, familyIncome: item.value })}
         
                   selectedTextStyle={{ color: themeColor.text, fontWeight: '600' }}
                     /* 👇 DROPDOWN LIST STYLING */
                   containerStyle={{
                     backgroundColor: themeColor.inputBackground, // full dropdown bg
                     borderRadius: 10,
                   }}
         
                   itemContainerStyle={{
                     backgroundColor: themeColor.inputBackground, // male/female row bg
                     borderRadius: 10,
                   }}
         
                   itemTextStyle={{
                     color: themeColor.text,
                   }}
         
                  activeColor={themeColor.selectItem} // selected item bg
                 />


      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.previous}]} onPress={() => setCurrentStep(1)}>
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