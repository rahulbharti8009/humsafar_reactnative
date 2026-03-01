import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity  } from 'react-native';
import { Chat } from '../types/auth';
import { MyCircle } from './MyCircle';
import { useTheme } from '../theme/ThemeContext';
import { getLastTime } from '../utils/helper';

export const ChatListItem: React.FC<{mobile? : string, user: Chat ,  onPress: () => void }> = ({mobile, user, onPress }) => {
    const { themeColor } = useTheme();

  return (
     <TouchableOpacity style={[styles.container, {backgroundColor: themeColor.background, borderColor: themeColor.borderColor, borderWidth: 0.5}]} onPress={onPress}  activeOpacity={0.7}>
          <View style={{flexDirection:'row'}}>
                    <MyCircle color={user.color} size={40}>
                      <Text style={[styles.mobile, {color: themeColor.text}]}>{`${user.mobile.substring(0,1)}`}</Text>
                    </MyCircle>
                      
                      <View style={styles.details}>
                      { <Text style={[styles.name, {color: themeColor.text}]}>{user?.name || user.mobile}</Text> }
                        {/* <Text style={[styles.mobile, {color: themeColor.text}]}>{user.mobile == mobile ? `Self\n${user.mobile}` : user.mobile}</Text> */}
                      {user?.last_message &&  <Text numberOfLines={1} style={[ {color: themeColor.googleButtonText }]}>{user?.last_message}</Text>}
                      
                      </View>
              </View>

          <View style={{flexDirection:"column", alignItems:"flex-end"}}>
         <Text style={[styles.time, {color: themeColor.time}]}>{`${getLastTime(user?.timestamp)}`}</Text> 

           {user.count > 0 &&  <MyCircle color={'#1A700D'} size={20}>
              <Text style={[styles.mobile, {color: '#ffffff'}]}>{`${user.count}`}</Text>
            </MyCircle>
              }

      </View>

    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  details: {
    flexDirection:'column',
    justifyContent:'center',
    alignItems:"flex-start",
    marginStart: 10
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  mobile: {
    color: '#555',
  },
  time: {
    fontSize: 12,
    fontWeight:'900'
  },
});