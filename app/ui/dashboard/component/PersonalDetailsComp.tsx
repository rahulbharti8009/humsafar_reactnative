
const genderList = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const casteList = [
  { label: "Brahmin", value: "Brahmin" },
  { label: "Kshatriya", value: "Kshatriya" },
  { label: "Vaishya", value: "Vaishya" },
];

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
import { calculateAge, getProfileData, heightList, setProfileData } from "../../../utils/localDB";
import type { PersonalDetails } from "../../../types/profile.type";
import { useFocusEffect } from "@react-navigation/native";
import BottomSheetDropdown from "../../../bottomSheet/BottomSheetDropdown";
import { indiaStates } from "../../../utils/india";
import RadioGroup from "../../../common/RadioGroup";
import { Religion } from "../../../utils/data";

export default function PersonalDetails({ setCurrentStep }: any) {
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState<PersonalDetails>({
    name: "",
    gender: "",
    dob: "",  
    age: "",
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

      if (!form.age || isNaN(form.age) || form.age < 18 || form.age > 100) {
        newErrors.age = "Enter valid age (18-100)";
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
const today = new Date();

// ✅ 18 years ago (latest allowed DOB)
const maxDate = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);

// ✅ 100 years ago (earliest allowed DOB)
const minDate = new Date(
  today.getFullYear() - 100,
  today.getMonth(),
  today.getDate()
);

  const renderInput = ({placeholder, key, isEditable = true}: {placeholder: string; key: keyof typeof form; isEditable?: boolean}) => (
    <TextInput
      editable={isEditable}
      value={form[key]}
      placeholder={placeholder}
      placeholderTextColor={themeColor.placeholder}
      style={[styles.input,{backgroundColor: themeColor.inputBackground, borderColor: themeColor.inputBorder, color: themeColor.text}, errors[key] && { borderColor: themeColor.error}]}
      onChangeText={(v) => setForm({ ...form, [key]: v })}
    />
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

        {renderInput({placeholder: "Full Name", key: "name"})}

        <RadioGroup
          label="Gender"
          options={genderList}
          value={form.gender}
          onChange={(val) => setForm({ ...form, gender: val as any })}
          error={!!errors.gender}
          themeColor={themeColor}
        />
       
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

        {/* DOB */}
        <TouchableOpacity
        style={[
            styles.input,{backgroundColor: themeColor.inputBackground, borderColor: themeColor.inputBorder, color: themeColor.text},
            errors.dob && { borderColor: themeColor.error },
          ]}  
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: form.dob ? themeColor.text : themeColor.placeholder }}>
            {form.dob || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
        {errors.dob && <Text style={styles.error}>{errors.dob}</Text>}

        {showPicker && (
          <DateTimePicker
            mode="date"
            value={form.dob ? new Date(form.dob) : maxDate}
            minimumDate={minDate}
            maximumDate={maxDate}
            themeVariant={theme == "dark" ? "dark" : "light"}
            onChange={(event, date) => {
              setShowPicker(false);
              setForm({
                ...form,
                dob: date?.toISOString().split("T")[0] || "",
                age: calculateAge(date?.toISOString().split("T")[0] || ""),
              });
            }}
          />
        )}

        {renderInput({placeholder: "Age", key: "age", isEditable: false})}
        {renderBottomSheet({placeholder: "Height", key: "height", data: heightList})}
        {renderBottomSheet({placeholder: "Religion", key: "religion", data: Religion})}
        {renderBottomSheet({placeholder: "Caste", key: "caste", data: form.religion ? Religion.filter(r => r.value === form.religion)[0]?.castes.map((c: any) => ({label: c.label, value: c.value})) : []})}
        {renderBottomSheet({placeholder: "State", key: "state", data: indiaStates})}
        {renderBottomSheet({placeholder: "City", key: "city", data: form.state != "" ? indiaStates.filter(s => s.value === form.state)[0]?.cities.map((c: string) => ({label: c, value: c})) : []})}
        {renderInput({placeholder: "Address", key:  "address"})}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={[styles.button,{backgroundColor:themeColor.tabBarActive}]} onPress={onNext}>
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
  borderRadius: 15,
  padding: 18,
  shadowOpacity: 0.08,
  shadowRadius: 10,
},
  input: {
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    borderColor: "#ccc",
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