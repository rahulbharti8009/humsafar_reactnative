import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AppButton from '../../component/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';
import { RouteName } from '../../utils/enum';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getLoginData, setLoginSave } from '../../utils/localDB';
import { LoginPayload, User } from '../../types/auth';
import { postApi } from '../../types/genericType';
import { ENDPOINT } from '../../api/endpoint';
import { ProfileEntity } from '../../types/profile.type';

const OTP_LENGTH = 6;
const TIMER_DURATION = 300; // 5 minutes in seconds
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Dashboard>;
};
type OtpRouteProp = RouteProp<RootStackParamList, RouteName.Otp>;
export const OtpScreen: React.FC<Props> = ({navigation}) => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const inputs = useRef<TextInput[]>([]);
  const route = useRoute<OtpRouteProp>();
    const [isLoading, setLoading] = useState<boolean>(false);
  
  const { email } = route.params || '';
  // ⏱ Timer
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

   
  const focusInput = (index: number) => {
    inputs.current[index]?.focus();
  };

const handleChange = (text: string, index: number) => {
  // ✅ PASTE
  if (text.length > 1) {
    const pasted = text.slice(0, OTP_LENGTH).split('');
    const newOtp = [...otp];

    pasted.forEach((d, i) => {
      newOtp[i] = d;
    });

    setOtp(newOtp);
    focusInput(OTP_LENGTH - 1);
    return;
  }

  const newOtp = [...otp];

  // ✅ DELETE DETECT (Android fix)
  if (text === '') {
    newOtp[index] = '';
    setOtp(newOtp);

    if (index > 0) {
      focusInput(index - 1);
    }
    return;
  }

  // ✅ NORMAL INPUT
  newOtp[index] = text;
  setOtp(newOtp);

  if (index < OTP_LENGTH - 1) {
    focusInput(index + 1);
  }
};

  const handleKeyPress = (
    e: any,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];

      // if current has value → clear it
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
        return;
      }

      // if empty → go to previous
      if (index > 0) {
        focusInput(index - 1);

        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const resendOtp = () => {
    setTimeLeft(TIMER_DURATION);
    setOtp(new Array(OTP_LENGTH).fill(''));
    inputs.current[0].focus();
    onLogin();
  };

  const onLogin = async () => {
       
          try {
              const payload: LoginPayload = {
                  email: email.toLowerCase()
                };
                setLoading(prev => prev = true)
                const res = await postApi<User, LoginPayload>(
                  ENDPOINT.AUTH.LOGIN,
                  payload 
                );
                    if(res.status) {
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


      const onVerify = async () => {
        try {
            const payload: LoginPayload = {
                email: email.trim().toLowerCase(),
                otp: otp.join('')
              };
              setLoading(prev => prev = true)
              const res = await postApi<User, LoginPayload>(
                ENDPOINT.AUTH.VERIFY_OTP,
                payload 
              );
                  if(res.status) {
                          // Alert.alert("success", res.message);
                        await setLoginSave(res.value!);
                              navigation.reset({
                                index: 0,
                                routes: [
                                  {
                                    name: RouteName.Dashboard,
                                    params: { user: res.value! },
                                  },
                                ],
                              });  
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
    <View style={styles.container}>
      <Text style={{}}>{`Otp has sent to ${email}`}</Text>
      <Text style={styles.title}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
           <TextInput
          key={index}
          ref={ref => (inputs.current[index] = ref!)}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
        />
        ))}
      </View>

      <Text style={styles.timer}>
        {timeLeft > 0 ? `0${formatTime(timeLeft)}` : 'OTP Expired'}
      </Text>

      {timeLeft === 0 && (
        <TouchableOpacity onPress={resendOtp}>
          <Text style={styles.resend}>Resend OTP</Text>
        </TouchableOpacity>
      )}
        <AppButton
          title="Verify"
          onPress={onVerify}
          isLoading={isLoading} 
          disabled={otp.join('').length < 6}
          style={{ marginTop: 30, width: '50%' }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
  },
  input: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  timer: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  resend: {
    marginTop: 15,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
