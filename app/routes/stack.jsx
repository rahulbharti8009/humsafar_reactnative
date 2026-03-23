import React,{useState, useEffect, use} from 'react';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { getLoginData } from '../utils/localDB';
import { RouteName } from '../utils/enum';
import { ProfileScreen } from '../ui/profile/ProfileScreen';
import { LoginScreen } from '../ui/auth/LoginScreen';
import { useAppSelector } from '../redux/hook/hook';
import { login, logout } from '../redux/slice/authSlice';
import { OtpScreen } from '../ui/auth/OtpScreen';
import { DashboardScreen } from '../ui/dashboard/DashboardScreen';
import { useTheme } from '../theme/ThemeContext';
import AppHeader from '../component/AppHeader';
import { BottomTabs } from '../bottomTab/BottomTabs';
import { ChatTab } from '../bottomTab/ChatTab';
import ChatHistoryUI from '../ui/chat/ChatHistory';
import { InviteListScreen } from '../ui/chat/InviteList';
import { ChatListScreen } from '../ui/chat/ChatList';
import { Alert, Linking } from 'react-native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { useDeepLink } from '../theme/DeepLinkContext';
import { ViewProfileScreen } from '../ui/profile/ViewProfileScreen';
 const navigationRef = createNavigationContainerRef();


const Stack = createNativeStackNavigator();

export const MyStack = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { theme , themeColor} = useTheme();
    const { deeplinkUrl , setDeeplinkUrl} = useDeepLink();
  
const linking = {
  prefixes: ['humsafar://',  'https://humsafar-node.onrender.com'],
  config: {
    screens: {
      [RouteName.Login]: 'login',
      [RouteName.Dashboard]: 'dashboard',
      [RouteName.Profile]: 'profile/:email',
      [RouteName.ChatHistory]: 'chat-history/:id',
      [RouteName.Chat]: 'chat/:id',
      [RouteName.ViewProfile]:'viewprofile/:email'
    },
  },
};

  useEffect(() => {
    const checkAuthDeepLing = async () => {
  

      const savedUser = await getLoginData();
          const url = await Linking.getInitialURL();
            if (url && !savedUser) {
                setDeeplinkUrl(url);
              }

      if (savedUser) {
        dispatch(login(savedUser));
      }

      setLoading(false);
    };

    checkAuthDeepLing();
  }, []);

  if (loading) return null;


  return (
    <NavigationContainer  ref={navigationRef}   linking={user ? linking : undefined}>
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right', }}
      initialRouteName={user != null ? RouteName.Dashboard : RouteName.Login}
    >
      <Stack.Screen name={RouteName.Login} component={LoginScreen} />

      <Stack.Screen name={RouteName.Profile} component={ProfileScreen}  
           options={({ navigation }) => ({
            headerShown: true,
            header: () => (
              <AppHeader
                title="Profile"
                onMenuPress={() => navigation.openDrawer()}
                logout={()=> {
                  dispatch(logout())
                  navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: RouteName.Login }], // your login screen name
                  })
                );
                }}
                goBack={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.navigate(RouteName.Dashboard);
                  }
                }}
              />
            ),
          })}
  />
     <Stack.Screen name={RouteName.Dashboard} component={BottomTabs} 
     options={({ navigation }) => ({
         headerShown: true,
          header: () => (
                <AppHeader
                  title={`${user?.name.substring(0,1).toUpperCase()}${user?.name.substring(1).toLowerCase() || user?.mobile || "Home"}`}
                  onMenuPress={() => navigation.openDrawer()}
                  onProfilePress={() => navigation.navigate(RouteName.Profile)}
                />
              ),
          })}/>

      <Stack.Screen name={RouteName.Otp} component={OtpScreen}  options={({ navigation }) => ({
         headerShown: true,
          header: () => (
                <AppHeader
                  title={'OTP'}
                  goBack={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } 
                }}
                />
              ),
          
            })}/>
      <Stack.Screen name={RouteName.ChatTab} component={ChatTab} />
      <Stack.Screen name={RouteName.ChatHistory} component={ChatHistoryUI} />
      <Stack.Screen name={RouteName.Invite} component={InviteListScreen} />
      <Stack.Screen name={RouteName.Chat} component={ChatListScreen} />
      <Stack.Screen name={RouteName.ViewProfile} component={ViewProfileScreen} 
         options={({ navigation }) => ({
         headerShown: true,
          header: () => (
                <AppHeader
                  title={'ViewProfile'}
                  goBack={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.navigate(RouteName.Dashboard);
                  }
                }}
                />
              ),
          
            })}/>
      
    </Stack.Navigator>
    </NavigationContainer>
  );
};
