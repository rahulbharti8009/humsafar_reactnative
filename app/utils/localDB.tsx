
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

