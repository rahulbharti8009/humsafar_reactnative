// components/CustomHeader.js

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import MySocket from '../utils/socket';
import { useAppSelector } from '../redux/hook/hook';

const CustomChattingHeader = ({ title, online  }: {title: string,online: string}) => {
    const { theme, toggleTheme, themeColor } = useTheme();
    const auth = useAppSelector((state) => state.auth.user)

  const navigation = useNavigation();
  const mySocket = MySocket.getInstance().getSocket();
  const checkIsUnread=()=> {
    mySocket?.emit(`unread`, {
      sender : auth?.mobile,
      reciever : title,
      isUnread: false
    });
  }
  return (
    <View
      style={{
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: themeColor.toolbar,
        borderBottomWidth: 1,
        borderBottomColor: themeColor.text + '30', // slight border tint
      }}
    >
      
      {/* Back Button + Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
           checkIsUnread()
          navigation.goBack()}}>
          <Image
            source={require('../../assets/back.png')}
            style={{
              width: 24,
              height: 24,
              tintColor: themeColor.text,
              marginRight: 12,
            }}
          />
        </TouchableOpacity>
      <View>
      <Text
          style={{
            color: themeColor.text,
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          {`${title.substring(0,1).toUpperCase()}${title.substring(1,title.length)}`}
        </Text>
     {online == 'online' && <Text
          style={{
            color: 'green',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          {online}
        </Text>
      }
      </View>
      </View>

    </View>
  );
};

export default CustomChattingHeader;
