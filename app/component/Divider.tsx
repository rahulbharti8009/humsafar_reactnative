import React from 'react'
import { View } from 'react-native'
import { useTheme } from '../theme/ThemeContext';

export const Divider = () => {
    const { themeColor } = useTheme();

  return (
     <View
       style={{
       width: 1,
       height: '60%',
       backgroundColor: themeColor.navbarTextColor,
     }}
   />
  )
}
