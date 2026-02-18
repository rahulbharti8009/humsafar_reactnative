import React,{useState, useEffect, use} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { getLoginData } from '../utils/localDB';
import { RouteName } from '../utils/enum';
import { DashboardScreen } from '../ui/dashboard/DashboardScreen';
import { LoginScreen } from '../ui/auth/LoginScreen';
import { useAppSelector } from '../redux/hook/hook';
import { login } from '../redux/slice/authSlice';
import { OtpScreen } from '../ui/auth/OtpScreen';

const Stack = createNativeStackNavigator();

export const MyStack = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

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
      <Stack.Screen name={RouteName.Dashboard} component={DashboardScreen} />
      <Stack.Screen name={RouteName.Otp} component={OtpScreen} />

    </Stack.Navigator>
    </NavigationContainer>
  );
};
