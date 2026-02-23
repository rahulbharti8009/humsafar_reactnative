import React from 'react'
import { useAppSelector } from '../redux/hook/hook'
import { View, ViewStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext';

type MyCircleProps = {
  children?: React.ReactNode;
  color?: string; 
  size?: number;
  marginTop?:number
  style?: ViewStyle;
};

export const MyCircle = ({ children, color, size = 50, marginTop = 0, style }: MyCircleProps) => {
  const user = useAppSelector((state) => state.auth.user)
  const { theme, toggleTheme, themeColor } = useTheme();

  const bgColor =
  color || themeColor.navbar;

  return (
    <View style={[{width: size, height:size, borderRadius: size/2, backgroundColor: bgColor,marginTop: marginTop, justifyContent:'center', alignItems:'center'},  style,]}>
        {children}
    </View>
  )
}
