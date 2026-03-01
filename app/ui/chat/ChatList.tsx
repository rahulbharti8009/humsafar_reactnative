import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../../utils/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MySocket from '../../utils/socket';
import { useTheme } from '../../theme/ThemeContext';
import { Chat, Invite, User } from '../../types/auth';
import { RouteName } from '../../utils/enum';
import { useAppSelector } from '../../redux/hook/hook';
import { InviteListItem } from '../../component/InviteListItem';
import { ChatListItem } from '../../component/ChatListItem';
import { ENDPOINT } from '../../api/endpoint';
import { postApi } from '../../types/genericType';
import NoDataFound from '../../common/NoDataFound';

export type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Chat>;
};
export const ChatListScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAppSelector((state) => state.auth.user)
    const [refreshing, setRefreshing] = useState<boolean>(true);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const { theme , themeColor } = useTheme();

                   const chatListApi=async()=> {
                          const payload = {
                             mobile : user?.mobile
                          }
                        const res = await postApi<Chat[], any>(
                          ENDPOINT.INVITE.CHAT_LIST,
                          payload 
                        );
                       
                        if(res.status) {
                          setChatList(res.value || [])
                        }
                    }

           useEffect((): (() => void) | void => {
            if (!user?.mobile) return;
              try{
                    onRefresh();
                  }
                  catch(error){
                  }
            }, [user?.mobile]);

   const onRefresh = async () => {
      setRefreshing(true);
        await chatListApi()
      setRefreshing(false);
    };


  return (
         <FlatList
              style={{ backgroundColor: themeColor.background }}
              data={chatList}
              keyExtractor={item => item.mobile}
              renderItem={({ item }) => (
                <ChatListItem
                  mobile={user?.mobile}
                  user={item}
                  onPress={() =>{
                     const socket = MySocket.getInstance().getSocket();
                      socket?.emit('readMsg', {
                      sender : user?.mobile,
                      reciever : item?.mobile
                    });

                    const handleReadMsg = () => {
                      console.log('read mesg');
                      socket?.emit('getchatList', {
                        mobile : user?.mobile
                      });
                      navigation.navigate(RouteName.ChatHistory, { user: item })
                    };
                    socket?.on(`readMsg${user?.mobile}`, handleReadMsg);

                  }
                  }
                />
              )}
               contentContainerStyle={{
                paddingVertical: Platform.OS === "ios" ? 40 : 20,
              }}
                refreshing={refreshing}   
                onRefresh={onRefresh}  
                ListEmptyComponent={<NoDataFound title={refreshing ? 'Loading...' : 'No Chat Found'} />}
            />
  );
};


const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'red',
    color: '#fff',
    minWidth: 18,
    height: 18,
    marginLeft: 6,
    borderRadius: 9,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    overflow: 'hidden',
  },
});
