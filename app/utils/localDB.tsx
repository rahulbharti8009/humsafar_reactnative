
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { User } from '../types/auth';

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


const USER_KEY = 'user';

export const saveUser = async (user: User) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

