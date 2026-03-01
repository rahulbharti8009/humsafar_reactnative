import React,{useState, useEffect, use} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { getLoginData } from '../utils/localDB';
import { RouteName } from '../utils/enum';
import { ProfileScreen } from '../ui/dashboard/ProfileScreen';
import { LoginScreen } from '../ui/auth/LoginScreen';
import { useAppSelector } from '../redux/hook/hook';
import { login } from '../redux/slice/authSlice';
import { OtpScreen } from '../ui/auth/OtpScreen';
import { DashboardScreen } from '../ui/dashboard/DashboardScreen';
import { useTheme } from '../theme/ThemeContext';
import AppHeader from '../component/AppHeader';
import { BottomTabs } from '../bottomTab/BottomTabs';
import { ChatTab } from '../bottomTab/ChatTab';
import ChatHistoryUI from '../ui/chat/ChatHistory';
import { InviteListScreen } from '../ui/chat/InviteList';
import { ChatListScreen } from '../ui/chat/ChatList';

const Stack = createNativeStackNavigator();

export const MyStack = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
    const { theme , themeColor} = useTheme();
  

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = await getLoginData();
      if (savedUser) {
        dispatch(login(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;


  return (
    <NavigationContainer>
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
                onProfilePress={() => alert("Profile")}
              />
            ),
          })}
  />
     <Stack.Screen name={RouteName.Dashboard} component={BottomTabs}   options={({ navigation }) => ({
         headerShown: true,
          header: () => (
                <AppHeader
                  title={`${user?.name.substring(0,1).toUpperCase()}${user?.name.substring(1).toLowerCase() || user?.mobile || "Home"}`}
                  onMenuPress={() => navigation.openDrawer()}
                  onProfilePress={() => alert("Profile")}
                />
              ),
          })}/>

      <Stack.Screen name={RouteName.Otp} component={OtpScreen} />
      <Stack.Screen name={RouteName.ChatTab} component={ChatTab} />
      <Stack.Screen name={RouteName.ChatHistory} component={ChatHistoryUI} />
      <Stack.Screen name={RouteName.Invite} component={InviteListScreen} />
      <Stack.Screen name={RouteName.Chat} component={ChatListScreen} />

    </Stack.Navigator>
    </NavigationContainer>
  );
};
