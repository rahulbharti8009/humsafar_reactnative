import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View , ImageBackground, StatusBar} from 'react-native'
import AnimatedInput from '../../component/AnimatedInput';
import { useTheme } from '../../theme/ThemeContext';

export const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  const { theme , themeColor} = useTheme();

      const onLogin = async () => {

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

         <Text>Welcome</Text>

        <AnimatedInput
          label="Email Address"
          placeholder="Email Address"
          value={username}
          isTheme={false}
          marginBottom={25}
          onChangeText={setUsername}
          // keyboardType="ascii-capable"
          maxLength={10}
        />


        <AnimatedInput
          label="Email Address"
          placeholder="Email Address"
          value={password}
          isTheme={false}
          marginBottom={25}
          onChangeText={setPassword}
          // keyboardType="ascii-capable"
          maxLength={10}
        />
        <Button title="Login" onPress={onLogin} />

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
