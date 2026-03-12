import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AppButton from '../../component/AppButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';
import { RouteName } from '../../utils/enum';
import { RouteProp, useRoute } from '@react-navigation/native';
import { setLoginSave } from '../../utils/localDB';
import { LoginPayload, User } from '../../types/auth';
import { postApi } from '../../types/genericType';
import { ENDPOINT } from '../../api/endpoint';
import { useTheme } from '../../theme/ThemeContext';

const OTP_LENGTH = 6;
const TIMER_DURATION = 300;

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    RouteName.Dashboard
  >;
};

type OtpRouteProp = RouteProp<RootStackParamList, RouteName.Otp>;

export const OtpScreen: React.FC<Props> = ({ navigation }) => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { theme , themeColor} = useTheme();

  const inputs = useRef<TextInput[]>([]);
  const route = useRoute<OtpRouteProp>();
  const { email } = route.params || '';

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

    if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        focusInput(index - 1);
      }
      return;
    }

    newOtp[index] = text;
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
        return;
      }

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
    inputs.current[0]?.focus();
    SendOtp();
  };

  const SendOtp = async () => {
    try {
      const payload: LoginPayload = {
        email: email.toLowerCase(),
      };

      setLoading(true);

      const res = await postApi<User, LoginPayload>(
        ENDPOINT.AUTH.LOGIN,
        payload
      );

      if (!res.status) {
        Alert.alert('Error', res.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    try {
      const payload: LoginPayload = {
        email: email.trim().toLowerCase(),
        otp: otp.join(''),
      };

      setLoading(true);

      const res = await postApi<User, LoginPayload>(
        ENDPOINT.AUTH.VERIFY_OTP,
        payload
      );

      if (res.status) {
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
        Alert.alert('Error', res.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
     <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
    <View style={[styles.container,{backgroundColor: themeColor.background}]}>
      <View style={[styles.card,{backgroundColor: themeColor.card}]}>

        <Text style={[styles.title,{color: themeColor.text}]}>Verify OTP</Text>

        <Text style={styles.subtitle}>OTP has been sent to</Text>

        <Text style={styles.email}>{email}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref!)}
              style={[styles.input,{color: themeColor.text,borderColor: themeColor.inputBorder, backgroundColor: themeColor.background}]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              cursorColor={themeColor.text}
              selectionColor={themeColor.text}
              returnKeyType="next"
              submitBehavior="submit"
            />
          ))}
        </View>

        <Text style={styles.timer}>
          {timeLeft > 0 ? `${formatTime(timeLeft)}` : 'OTP Expired'}
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
          style={{ marginTop: 25, width: '80%' }}
        />

      </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: '#F5F7FB',
},

card: {
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 20,
  paddingVertical: 35,
  paddingHorizontal: 20,
  alignItems: 'center',

  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 5,
},

title: {
  fontSize: 24,
  fontWeight: '700',
  marginBottom: 10,
},

subtitle: {
  fontSize: 14,
  color: '#777',
},

email: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 25,
},

otpContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '90%',
},

input: {
  width: 45,
  height: 55,
  borderWidth: 1.5,
  borderColor: '#ddd',
  borderRadius: 12,
  textAlign: 'center',
  fontSize: 22,
  fontWeight: '600',
  backgroundColor: '#FAFAFA',
},

timer: {
  marginTop: 20,
  fontSize: 15,
  color: '#5f1212',
},

resend: {
  marginTop: 12,
  fontSize: 15,
  color: '#3B82F6',
  fontWeight: '600',
},

});