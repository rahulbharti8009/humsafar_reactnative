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
            <Stack.Screen name={RouteName.Dashboard} component={DashboardScreen}   options={({ navigation }) => ({
         headerShown: true,
        header: () => (
              <AppHeader
                title="Dashboard"
                onMenuPress={() => navigation.openDrawer()}
                onProfilePress={() => alert("Profile")}
              />
            ),
          })}/>

      <Stack.Screen name={RouteName.Otp} component={OtpScreen} />

    </Stack.Navigator>
    </NavigationContainer>
  );
};
