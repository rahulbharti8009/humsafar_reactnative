
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { User } from '../types/auth';
import { PersonalDetails, ProfileEntity } from '../types/profile.type';

export const setLoginSave = async(value: User)=> {
   await AsyncStorage.setItem("user",  JSON.stringify(value));
}

export const getLoginData = async (): Promise<User | null> => {
   const user = await AsyncStorage.getItem("user");
    return  user ? JSON.parse(user) : null;
 };

 export const clearLoginData = async (): Promise<void> => {
  await AsyncStorage.removeItem("user");
};

 export const checkInternetConnection=async() : Promise<boolean> =>{
   const state = await NetInfo.fetch()
   return !!state.isConnected
 }

//  
export const setProfileData = async (profileData: PersonalDetails): Promise<void> => {
  await AsyncStorage.setItem("profile_personal_details", JSON.stringify(profileData));
};

export const getProfileData = async (): Promise<PersonalDetails | null> => {
   const user = await AsyncStorage.getItem("profile_personal_details");
    return  user ? JSON.parse(user) : null;
 };

 export const setProfileExpData = async (profileData: ProfileEntity): Promise<void> => {
  await AsyncStorage.setItem("profile_exp_details", JSON.stringify(profileData));
};

export const getProfileExpData = async (): Promise<ProfileEntity | null> => {
   const user = await AsyncStorage.getItem("profile_exp_details");
    return  user ? JSON.parse(user) : null;
 };


const USER_KEY = 'user';

export const saveUser = async (user: User) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

// export const Religion = [
//   { label: "Hindu", value: "Hindu" },
//   { label: "Muslim", value: "Muslim" },
//   { label: "Christian", value: "Christian" },
//   { label: "Sikh", value: "Sikh" },
//   { label: "Buddhist", value: "Buddhist" },
//   { label: "Jain", value: "Jain" },
//   { label: "Parsi", value: "Parsi" },
//   { label: "Jewish", value: "Jewish" },
//   { label: "Baháʼí", value: "Baháʼí" },
//   { label: "Tribal", value: "Tribal" },
// ];

export const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age}`;
};

const generateHeightList = () => {
  const heights: { label: string; value: string }[] = [];

  for (let feet = 3; feet <= 7; feet++) {
    for (let inch = 0; inch < 12; inch++) {
      const label = `${feet} feet ${inch} inch`;
      const value = `${feet}.${inch}`;
      heights.push({ label, value });
    }
  }

  return heights;
};

export const heightList = generateHeightList();