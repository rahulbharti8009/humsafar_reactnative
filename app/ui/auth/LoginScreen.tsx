import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View , ImageBackground, StatusBar, Alert} from 'react-native'
import AnimatedInput from '../../component/AnimatedInput';
import { useTheme } from '../../theme/ThemeContext';
import AppButton from '../../component/AppButton';
import { useNavigation } from '@react-navigation/native';
import { RouteName } from '../../utils/enum';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';
import { LoginPayload, User } from '../../types/auth';
import { postApi } from '../../types/genericType';
import { ENDPOINT } from '../../api/endpoint';
import { isValidEmail } from '../../utils/helper';
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Login>;
};
export const LoginScreen : React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState("rahulbharti5822@gmail.com");
  const { theme , themeColor} = useTheme();
  const [isLoading, setLoading] = useState<boolean>(false);

      const onLogin = async () => {
      if (email.trim() === '' || !isValidEmail(email)) {
          Alert.alert("Validation Error", "Email shouldn't be empty and must be valid");
          return;
        }
        try {
            const payload: LoginPayload = {
                email: email
              };
              setLoading(prev => prev = true)
              const res = await postApi<User, LoginPayload>(
                ENDPOINT.AUTH.LOGIN,
                payload 
              );
                  if(res.status) {
                     navigation.navigate(RouteName.Otp,{email: email})
                  } else {
                    Alert.alert("Error", res.message);
                  }
            } catch (error) {
             console.log(  error);
              Alert.alert("Error", "Something went wrong");
            } finally {
            setLoading(false); 
           }
      };

  return (
        <ImageBackground
      source={require('../../../assets/bg.jpg')} // 👈 your image
      style={{flex: 1}} // 👈 make sure it covers the whole screen
      resizeMode="cover" // cover / contain / stretch
    >
          {/* <StatusBar hidden translucent backgroundColor="transparent" /> */}

    <View style={[style.overlay]} />
    <View style={[style.containner,{}]}>

        <AnimatedInput
          label="Email Address"
          placeholder="Email Address"
          value={email}
          isTheme={false}
          marginBottom={25}
          onChangeText={setEmail}
          // keyboardType="ascii-capable"
          maxLength={10}
        />

        <AppButton
          title="Login"
          isLoading={isLoading} 
          onPress={onLogin}
        />
    </View>
    </ImageBackground>
  )
}


const style = StyleSheet.create({
containner:{
  flex: 1,
  padding: '10%',
  justifyContent: 'center',
  alignItems: 'center',
},
 overlay: {
    ...StyleSheet.absoluteFill,  // cover full screen
    backgroundColor: 'rgba(5, 7, 10, 0.6)', // 🔥 darkness level
  },
    input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    fontSize: 16,
  }
})
