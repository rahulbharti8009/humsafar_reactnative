import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  isLoading?: boolean;
};

const AppButton: React.FC<Props> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  isLoading = false,
}) => {
    const { theme , themeColor} = useTheme();
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.disabledButton,
        { backgroundColor: themeColor.button_bg_color },
        style,
      ]}
    >
        {isLoading ? <ActivityIndicator size="small" color="#6b0303"/> : <Text style={[styles.text, textStyle,{color: themeColor.text}]}>{title}</Text> }
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
});
