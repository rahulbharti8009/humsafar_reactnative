import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { getLoginData } from '../../utils/localDB'
import { LoginPayload, User } from '../../types/auth';
import { useTheme } from '../../theme/ThemeContext';
import { ENDPOINT } from '../../api/endpoint';
import { postApi } from '../../types/genericType';
import { ProfileEntity } from '../../types/profile.type';
import { ProfileScreen } from './ProfileScreen';
import ProfileList from './component/ProfileList';
import { log } from '../../utils/helper';
import ProfileListScreen from './component/ProfileList';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slice/authSlice';
import { useAppSelector } from '../../redux/hook/hook';
import MySocket from '../../utils/socket';

const tag ="DashboardScreen"
export const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme , themeColor} = useTheme();
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.auth.user);
      
  
const [profileList, setProfileList] = React.useState<ProfileEntity[]>([]);
// useEffect((): (() => void) | void => {
//   if (!user?.mobile) return;
//   const mobile: string = user.mobile;
//   const socket = MySocket.getInstance().connect(mobile);
//   try {
//     // 🔥 CONNECT LISTENERS
//     const handleConnect = (): void => {
//       console.log('✅ Connected:', socket.id);
//     };

//     const handleDisconnect = (reason: string): void => {
//       console.log('❌ Disconnected:', reason);
//     };

//     const handleConnectError = (error: Error): void => {
//       console.log('🚨 Connection Error:', error.message);
//     };

//      if (!socket.connected) {
//       socket.connect();
//     }

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('connect_error', handleConnectError);
//     // 🔥 CLEANUP
//     return (): void => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('connect_error', handleConnectError);
//       socket.disconnect();
//     };
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.log('Unexpected error:', error.message);
//     }
//   }

// }, [user?.mobile]);

  useEffect(()=> {
    if(user != null && user.isProfileActive) {        
        profileApi();
    }
  },[user])

  const profileApi =async()=> {
    setLoading(true)
    try{
    const payload : LoginPayload={
      email: user?.email || ""
    }
        const profile = await postApi<ProfileEntity, LoginPayload>(
        ENDPOINT.PROFILE.PROFILE_LIST,
        payload 
        );

        if(profile.status && profile.value){
           setProfileList(Array.isArray(profile.value) ? profile.value : [profile.value])
        }
    }catch(error){
      log(tag, error)
    } finally{
      setLoading(false)
    }

  }

    if (user == null) return
    if (isLoading) return <Text>Loading...</Text>

    const onRefresh = async () => {
      setRefreshing(true);
      await profileApi();  
      setRefreshing(false);
    };

    const ComponentType=()=> {
      if (user != null && !user.isProfileActive) {
        return  <ScrollView contentContainerStyle={{ padding: 10}}>
                    <ProfileScreen />
                    </ScrollView> 
                }
              
        return  <ProfileListScreen profileList={profileList} onRefresh={onRefresh} refreshing={refreshing} /> 
    }

  return (
  <View style={{flex: 1, backgroundColor: themeColor.background}}>
      <ComponentType />
  </View>
  )
}
