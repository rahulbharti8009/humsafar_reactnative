import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
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
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Invite>;
};
export const InviteListScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAppSelector((state) => state.auth.user)
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [inviteList, setInviteList] = useState<Invite[]>([]);
  const { theme , themeColor, setNotification } = useTheme();

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
                          setNotification(res.value && res.value.length > 0 ? res.value.length : 0);
                        }
                    }
            
                  const rejectUserApi=async(payload: any)=> {
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
                      }
                    }
                  const acceptUserApi=async(payload: any)=> {
                        try{
                        const res = await postApi<Invite[], any>(
                          ENDPOINT.INVITE.ACCEPT_USER,
                          payload 
                        );
                       
                        if(res.status) {
                        setInviteList(res.value || []);
                        }
                      }catch(error){
                        console.log(error);
                      }finally{
                      }
                    }

           useEffect((): (() => void) | void => {
            if (!user?.mobile) return;
              try{
                onRefresh()
                  }
                  catch(error){
                  } finally {
                  }
            }, [user?.mobile]);

   const onRefresh = async () => {
      setRefreshing(true);
        await inviteListApi()
      setRefreshing(false);
    };
    
  return (
       <FlatList
              style={{ backgroundColor: themeColor.background }}
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
                ListEmptyComponent={<NoDataFound title={refreshing ? 'Loading...' : 'No Invites Found'} />}
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
