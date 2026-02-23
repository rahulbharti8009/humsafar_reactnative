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

const tag ="DashboardScreen"
export const DashboardScreen = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const { theme , themeColor} = useTheme();
      const [isLoading, setLoading] = useState<boolean>(false);
  
const [profileList, setProfileList] = React.useState<ProfileEntity[]>([]);
  useEffect(()=> {
      const fetchData = async () => {
            await getLoginData().then(res => {
              if (res) {
                setUser(res);
             
              } 
            });
          };
          fetchData();
        
  },[])
// dependency on user
  useEffect(()=> {
    if(user != null){
        profileApi();
    }
  },[user])

  const profileApi =async()=> {
    setLoading(true)
    try{
    const payload : LoginPayload={
      email: ''
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

    const ComponentType=()=> {
      if (user != null && profileList.length === 0) {
        return  <ScrollView contentContainerStyle={{ padding: 10}}>
                    <ProfileScreen/>
                    </ScrollView> 
                }

        return  <ProfileListScreen profileList={profileList}/>
    }

  return (
  <View style={{flex: 1, backgroundColor: themeColor.background}}>
      <ComponentType />
  </View>
  )
}
