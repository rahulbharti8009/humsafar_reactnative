
const genderList = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const casteList = [
  { label: "Brahmin", value: "Brahmin" },
  { label: "Kshatriya", value: "Kshatriya" },
  { label: "Vaishya", value: "Vaishya" },
];

const stateList = [
  { label: "Delhi", value: "Delhi" },
  { label: "Uttar Pradesh", value: "UP" },
];

const cityData: any = {
  Delhi: [
    { label: "New Delhi", value: "New Delhi" },
    { label: "Laxmi Nagar", value: "Laxmi Nagar" },
  ],
  UP: [
    { label: "Agra", value: "Agra" },
    { label: "Lucknow", value: "Lucknow" },
  ],
};
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "../../../theme/ThemeContext";
import { getProfileData, setProfileData } from "../../../utils/localDB";
import type { PersonalDetails } from "../../../types/profile.type";
import { useFocusEffect } from "@react-navigation/native";

export default function PersonalDetails({ setCurrentStep }: any) {
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState<PersonalDetails>({
    name: "",
    gender: "",
    dob: "",  
    height: "",
    religion: "",
    caste: "",
    state: "",
    city: "",
    address: "",
  });
    const { theme , themeColor} = useTheme();
  

  const [cities, setCities] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        await getProfileData().then(res => {
          if (res) {
            setForm(res);
          } 
        });
      };
      fetchData();
    },[]);

    const validate = () => {
      let valid = true;
      let newErrors: any = {};

      if (!form.name || form.name.length < 3) {
        newErrors.name = "Enter valid name";
        valid = false;
      }

      if (!form.gender) {
        newErrors.gender = "Select gender";
        valid = false;
      }

      if (!form.dob) {
        newErrors.dob = "Select DOB";
        valid = false;
      }

      if (!form.height) {
        newErrors.height = "Enter height";
        valid = false;
      }

      if (!form.religion) {
        newErrors.religion = "Select religion";
        valid = false;
      }


      if (!form.caste) {
        newErrors.caste = "Select caste";
        valid = false;
      }

      if (!form.state) {
        newErrors.state = "Select state";
        valid = false;
      }

      if (!form.city) {
        newErrors.city = "Select city";
        valid = false;
      }

      if (!form.address) {
        newErrors.address = "Enter address";
        valid = false;
      }
      setErrors(newErrors);
      return valid;
    };

      const onNext = () => {
        if (validate()) {
          setProfileData(form);
          setCurrentStep(2);
        }
      };

  const renderInput = (placeholder: string, key: keyof typeof form) => (
    <TextInput
      value={form[key]}
      placeholder={placeholder}
      placeholderTextColor={themeColor.placeholder}
      style={[styles.input,{backgroundColor: themeColor.inputBackground}, errors[key] && { borderColor: themeColor.error}]}
      onChangeText={(v) => setForm({ ...form, [key]: v })}
    />
  );

  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:themeColor.background}]}>
      <View style={[styles.card,{backgroundColor:themeColor.inputBackground}]}>

        {renderInput("Full Name", "name")}

        <Dropdown
          style={[
            styles.dropdown,{backgroundColor: themeColor.inputBackground},
            errors.gender && { borderColor:themeColor.error },
          ]}        
          
          data={genderList}
          labelField="label"
          valueField="value"
          placeholder="Select Gender"
          placeholderStyle={{ color: themeColor.placeholder }} 
          value={form.gender}
          onChange={(item) => setForm({ ...form, gender: item.value })}

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
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

        {/* DOB */}
        <TouchableOpacity
 style={[
    styles.input,{backgroundColor: themeColor.inputBackground,},
    errors.dob && { borderColor: themeColor.error },
  ]}          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: form.dob ? themeColor.text : "#999" }}>
            {form.dob || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
{errors.dob && <Text style={styles.error}>{errors.dob}</Text>}

        {showPicker && (
          <DateTimePicker
            mode="date"
            value={new Date()}
            onChange={(event, date) => {
              setShowPicker(false);
              setForm({
                ...form,
                dob: date?.toISOString().split("T")[0] || "",
              });
            }}
          />
        )}

        {renderInput("Height (e.g. 5.8)", "height")}
        {renderInput("Religion", "religion")}

        <Dropdown
          style={[
            styles.dropdown,{backgroundColor: themeColor.inputBackground},
            errors.caste && { borderColor:themeColor.error },
          ]}  
          data={casteList}
          labelField="label"
          valueField="value"
          placeholder="Select Caste"
                    placeholderStyle={{ color: themeColor.placeholder }} 

          value={form.caste}
          onChange={(item) => setForm({ ...form, caste: item.value })}
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

        <Dropdown
          style={[
                      styles.dropdown,{backgroundColor: themeColor.inputBackground},
                      errors.state && { borderColor: themeColor.error },
                    ]} 
          data={stateList}
          labelField="label"
          valueField="value"
          placeholder="Select State"
                    placeholderStyle={{ color: themeColor.placeholder }} 

          value={form.state}
          onChange={(item) => {
            setForm({ ...form, state: item.value, city: "" });
            setCities(cityData[item.value]);
          }}

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

        <Dropdown
        style={[
                    styles.dropdown,{backgroundColor: themeColor.inputBackground},
                    errors.city && { borderColor: themeColor.error},
                  ]}  
          data={cities}
          labelField="label"
          valueField="value"
          placeholder="Select City"
                    placeholderStyle={{ color: themeColor.placeholder }} 

          value={form.city}
          onChange={(item) => setForm({ ...form, city: item.value })}

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

        {renderInput("Address", "address")}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.next}]} onPress={onNext}>
          <Text style={[styles.buttonText, {color:themeColor.button_text_color}]}>Next</Text>
        </TouchableOpacity>
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
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
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
    marginBottom: 14,
    backgroundColor: "#fafafa",
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
});