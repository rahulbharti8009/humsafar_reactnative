import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAppSelector } from '../redux/hook/hook';

type AnimatedInputProps = TextInputProps & {
    label: string;
    marginTop?: number;
    marginBottom?:number;
    isOtp?: boolean;
    disabled?: boolean;
    bgcolor?: string;
    placeholder?: string;
    isTheme?: boolean;
};

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  marginTop = 0,
  marginBottom = 18,
  disabled = false,
  isOtp = false,
  placeholder = '',
  isTheme = true,
  ...props
}) => {
    const [isFocused, setIsFocused] = useState(true);
    const {theme, themeColor } = useTheme();

    let getColor =()=> {
      if(isTheme) {
        return themeColor.text
      } else{
        return themeColor.button_text_color
      }
    }

  return (
    <View style={[styles.wrapper,{ marginTop: marginTop, marginBottom : marginBottom }]}>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={'#a4a4a4'}
        editable={!disabled}
        onFocus={() => setIsFocused(isFocused => !isFocused)}
        onBlur={() => setIsFocused(false)}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={isOtp}
        autoFocus={true} 
        textContentType="oneTimeCode"
        style={[styles.input,{ borderColor: isFocused ?  themeColor.borderColor : '#B0B0B0' , textAlign:  'center'  , color: getColor()
    }]}
      />
    </View>
  );
};

export default AnimatedInput;
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
