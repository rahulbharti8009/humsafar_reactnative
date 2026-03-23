import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Icon } from "./ImageComp";
import { MyCircle } from "./MyCircle";
import { clearAll, clearLoginData, getProfileExpData, setLoginSave } from "../utils/localDB";
import { log } from "../utils/helper";
import { SOCKET_URL } from "../utils/constant";
import { useAppSelector } from "../redux/hook/hook";

export default function AppHeader({
  title,
  onMenuPress,
  onProfilePress,
  goBack,
  logout
}: any) {
      const { theme, toggleTheme, themeColor } = useTheme();
        const profile = useAppSelector(state => state.profile.profile);

const ImageType =()=> {
  if(title === 'Profile' || title === 'ViewProfile' || title === 'OTP'){
    return  <TouchableOpacity
              onPress={goBack}
                    activeOpacity={0.7}
                  >
                    <Icon
                      size={35}
                          source={ require("../../assets/back.png") }
                          tintColor={themeColor.text}
                          />
              </TouchableOpacity>
  }

  return <MyCircle  size={40} color={themeColor.profileSelecter}>
              <TouchableOpacity
              onPress={onProfilePress}
                    activeOpacity={0.7}
                   
                  >
                    <Icon
                      size={35}
                          source={
                              profile?.profileImages && profile?.profileImages?.uri
                                ? { uri: `${SOCKET_URL}/${profile?.profileImages?.uri}` }
                                : require("../../assets/ic_user.png")
                            }
                    />
              </TouchableOpacity>
               </MyCircle>
}
  return (
    <View style={[styles.container, { backgroundColor: themeColor.statusbar }]}>
      <StatusBar barStyle="light-content" />

      {/* LEFT ICON */}
    <ImageType/>

      {/* TITLE */}
      <Text style={styles.title}>{title}</Text>
{/* RIGHT ICON */}
<View style={{flexDirection:'row', gap: 10}}>
   
      {/* RIGHT ICON */}
     <TouchableOpacity onPress={() => {
              toggleTheme();
              console.log('theme')}}>
            <View style={[{padding: 0,}]}>
                <Icon
                  source={theme === 'dark' ? require('../../assets/ic_dark_theme.png') : require('../../assets/ic_light_theme.png')}
                  size={30}
                  tintColor={theme === 'dark' ? themeColor.white: themeColor.black}
                /> 
              </View>
            </TouchableOpacity>
              {title == 'Profile' && <TouchableOpacity onPress={async() => {
                 logout()
            }}>
            <View style={[{padding: 0,}]}>
                <Icon
                  source={theme === 'dark' ? require('../../assets/ic_logout.png') : require('../../assets/ic_logout.png')}
                  size={30}
                  tintColor={theme === 'dark' ? themeColor.white: themeColor.black}
                /> 
              </View>
            </TouchableOpacity>
            }
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 6,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});