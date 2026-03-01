import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../utils/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MySocket from '../utils/socket';
import { useTheme } from '../theme/ThemeContext';
import { Chat, Invite, User } from '../types/auth';
import { RouteName } from '../utils/enum';
import { useAppSelector } from '../redux/hook/hook';
import { InviteListItem } from '../component/InviteListItem';
import { ChatListItem } from '../component/ChatListItem';
import { ENDPOINT } from '../api/endpoint';
import { postApi } from '../types/genericType';
import { ProfileEntity } from '../types/profile.type';
import NoDataFound from '../common/NoDataFound';

export type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.ChatTab>;
};
export const ChatTab: React.FC<Props> = ({ navigation }) => {
  const user = useAppSelector((state) => state.auth.user)
    const [refreshing, setRefreshing] = useState<boolean>(false);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [inviteList, setInviteList] = useState<Invite[]>([]);
  const [isLoading, setlaoding] = useState(true);
  const [chatType, setChatType] = useState('chat');
  const { theme , themeColor } = useTheme();

                 const inviteListApi=async()=> {
                          const payload = {
                               mobile : user?.mobile
                          }
                        const res = await postApi<Invite[], any>(
                          ENDPOINT.INVITE.INVITE_LIST,
                          payload 
                        );
                       
                        if(res.status) {
                          setInviteList(res.value || []);
                        }
                    }
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
                  const rejectUserApi=async(payload: any)=> {
                         setlaoding(true)
                        try{
                        const res = await postApi<Invite[], any>(
                          ENDPOINT.INVITE.REJECT_USER,
                          payload 
                        );
                       
                        if(res.status) {
                         inviteListApi();
                        }
                      }catch(error){
                        console.log(error);
                      }finally{
                        setlaoding(false)
                      }
                    }
                  const acceptUserApi=async(payload: any)=> {
                         setlaoding(true)
                        try{
                        const res = await postApi<Invite[], any>(
                          ENDPOINT.INVITE.ACCEPT_USER,
                          payload 
                        );
                       
                        if(res.status) {
                        setInviteList(res.value || []);
                         chatListApi();
                        }
                      }catch(error){
                        console.log(error);
                      }finally{
                        setlaoding(false)
                      }
                    }

           useEffect((): (() => void) | void => {
            if (!user?.mobile) return;

            setlaoding(true)
              try{
            inviteListApi()
            chatListApi()
                  }
                  catch(error){

                  } finally {
                    setlaoding(false)
                  }
            }, [user?.mobile]);

   const onRefresh = async () => {
      setRefreshing(true);
        await inviteListApi()
        await chatListApi()
      setRefreshing(false);
    };
    
  const ComponentType = () => {
    switch (chatType) {
      case 'chat':
        return chatList.length != 0 ? (
          <>
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
                refreshing={refreshing}   
                onRefresh={onRefresh}  
                ListEmptyComponent={<NoDataFound />}
            />
          </>
        ) : (<View style={{ backgroundColor: themeColor.background, width: '100%', height: '100%', justifyContent:'center', alignItems:'center' }}>
          <Text style={{color : theme == 'dark' ? themeColor.white: themeColor.black}}>No Chat Data</Text>
          </View>);
      case 'invite':
          return  <FlatList
                style={{ backgroundColor: themeColor.background, paddingTop: 10 }}
                data={inviteList}
                keyExtractor={item => item.mobile}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 10 }} />
                )}
                renderItem={({ item }) => (
                  <InviteListItem
                    mobile={user?.mobile}
                    user={item}
                    onPress={(requestType) =>{
                    
                      const params = {
                        sender : {
                           sender : user?.mobile,
                           name : user?.name,
                           mobile : user?.mobile,
                           color : user?.color
                        },
                        reciever : {
                            reciever :  item.mobile,
                            name :  item.name,
                            mobile :  item.mobile,
                            color :  item.color
                        }
                      }

                      if(requestType === 'REJECT'){
                        rejectUserApi(params)
                      } else {
                        acceptUserApi(params)
                      }
                    }
                    }
                  />
                )}
                refreshing={refreshing}   
                onRefresh={onRefresh}  
                ListEmptyComponent={<NoDataFound />}
              />
          
    }
  };

  if(isLoading) return(<Text>Loading</Text>)

    const getColor=()=> {
      if(theme == 'dark'){
          if(chatType === 'chat') return themeColor.inputBackground
           else  if(chatType == 'invite') return themeColor.inputBackground
           else return '#000000'
      } else {
        if(chatType === 'chat') return themeColor.inputBackground
       else if(chatType == 'invite') return themeColor.inputBackground
       else return '#000000'
      }
    }

  return (
    <View style={{width:'100%', height:'100%'}}>
      <ComponentType />
      <View
          style={{
            bottom: 20,
            position: 'absolute',
            width: '50%',
            height: 50,
            backgroundColor: themeColor.statusbar ,
            borderRadius: 50,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingHorizontal: 10,
          }}
>
  {/* Chat */}
  <TouchableOpacity
    onPress={() => setChatType('chat')}
    style={[
      styles.tab,
       chatType == 'chat' &&  {
        backgroundColor: themeColor.navbarTextBgColor,
      },
    ]}
  >
    <Text style={{ color: getColor()}}>Chat</Text>
  </TouchableOpacity>

  {/* <Divider /> */}

  {/* Invite */}
  <TouchableOpacity
    onPress={() => setChatType('invite')}
    style={[
      styles.tab,
      chatType == 'invite' &&  {
        backgroundColor: themeColor.navbarTextBgColor,
      },
    ]}
  >
    <Text style={{ color: getColor()}}>Invite</Text>

    {inviteList.length > 0 && (
      <Text style={styles.badge}>{inviteList.length}</Text>
    )}
  </TouchableOpacity>


  {/* Group */}
  {/* <TouchableOpacity
    onPress={() => navigation.navigate(RouteName.AddGroupUI)}
    style={styles.tab}
  >
    <Text style={{ color: themeColor.navbarTextColor }}>Group +</Text>
  </TouchableOpacity> */}
</View>

    </View>
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
