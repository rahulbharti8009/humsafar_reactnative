import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { RouteName } from '../../utils/enum';
import { useAppSelector } from '../../redux/hook/hook';
import MySocket from '../../utils/socket';
import { useTheme } from '../../theme/ThemeContext';
import { postApi } from '../../types/genericType';
import { ChatHistoryPayload, ChatMessage, RootStackParamList } from '../../utils/types';
import CustomChattingHeader from '../../component/CustomChattingHeader';
import { ENDPOINT } from '../../api/endpoint';
import NoDataFound from '../../common/NoDataFound';

type ChatRouteProp = RouteProp<
  RootStackParamList,
  RouteName.ChatHistory
>;

/* ---------------- COMPONENT ---------------- */

const ChatHistoryUI = () => {
  const route = useRoute<ChatRouteProp>();
  const { user } = route.params;
  const auth = useAppSelector((state) => state.auth.user)
  const [isRecieverUnread, setIsRecieverUnread] = useState<boolean>(false);
  const mySocket = MySocket.getInstance();
  const socket = mySocket.getSocket();
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const { theme, toggleTheme, themeColor } = useTheme();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const [autoSctoll, setAutoSctoll] = useState(true);

  useFocusEffect(
    useCallback(() => {
      console.log('Component B is focused again');
      return () => {
        console.log('Component B lost focus');
      };
    }, [])
  );

    /* ---------------- LOAD CHAT HISTORY ---------------- */
  const handleChatHistory = async (pageNumber = 1) => {
      if (loading || !hasMore) return;
  setLoading(true);

    try {
      const payload: ChatHistoryPayload = {
        name: `${auth?.mobile}-${user.mobile}`,
         page: pageNumber,
        limit: 20,
      };
      const data = await postApi<ChatMessage[], ChatHistoryPayload>(
        ENDPOINT.CHAT.CHAT_HISTORY,
        payload
      );

        if (data.status) {
      if (pageNumber === 1) {
        setChat(data.value || []);
      } else {
        // prepend older messages
      setChat(prev => [...(data.value || []), ...prev]);      }

      setHasMore(data.hasMore || false);
      setPage(pageNumber);
    }

          } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
  };
  /* ---------------- UNREAD / ONLINE STATUS ---------------- */

  const checkIsUnread=()=> {
    socket?.emit(`unread`, {
      sender : auth?.mobile,
      reciever : user.mobile,
      isUnread: true
    });
  }

  useEffect(()=> {
    if(isRecieverUnread){
      checkIsUnread()
    }
  },[isRecieverUnread])

    /* ---------------- SOCKET LISTENERS ---------------- */

  useEffect(() => {
    handleChatHistory(1);
    const socketParams = `message${ user.mobile ==  undefined ? `${user?.name.toString()}-${user?.name.toString()}`: `${auth?.mobile}-${user.mobile.toString()}`}`;
    socket?.on(socketParams, (msg: ChatMessage) => {
      console.log('useEffect socket ', msg);
    setChat(prev => [...prev, msg]); // because inverted
    setIsAtBottom(true);
    // flatListRef.current?.scrollToOffset({
    //   offset: 0,
    //   animated: true,
    // });
        // chat list
      socket.emit('getchatList', {
        mobile : user.mobile
      });
    });
// ======= unread =======
    checkIsUnread()
    socket?.on(`unread${auth?.mobile}`, (user: any) => {
      if(user != undefined){
      setIsRecieverUnread(()=> user.isUnread)
      }
    })
    
    return () => {
      socket?.off(socketParams);
      socket?.off(`unread${user.mobile}`)
    };
  }, [user.mobile]);

    /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = () => {
    if (!auth?.mobile || !message.trim()) return;

    const t = new Date();
    const date = `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;

    let hours = t.getHours();
    const minutes = t.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${ampm}`;
// Alert.alert(`${user.mobile}`,`${JSON.stringify(user)}`)
    const body: ChatMessage = {
      message: message.trim(),
      from: auth?.mobile.toString(),
      clientFrom: auth?.mobile,
      clientTo: user.mobile,
      date: date,
      time: time,
      isUnread:isRecieverUnread,
      fcmToken: '',
    };

    socket?.emit('user-message', body);

    setMessage(()=> '');
  };

    /* ---------------- AUTO SCROLL TO BOTTOM ---------------- */

    useEffect(() => {
     
      if (isAtBottom) {
          flatListRef.current?.scrollToEnd({
            animated: true,
          });
      }
    }, [chat]);

const [isAtBottom, setIsAtBottom] = useState(true);
const lastOffset = useRef(0);

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  // keyboardVerticalOffset={20}
>
    <View style={{ backgroundColor: themeColor.background   , flex: 1}}>
          <CustomChattingHeader
        title={`${user.mobile}`} online={isRecieverUnread ? 'online': 'offline'}
      />
          <FlatList
              ref={flatListRef} 
              data={chat}
              style={{ flex: 1, padding: 10 }}
              onStartReached={() => {
                console.log('start reached');
                if (hasMore && !loading && chat.length >= 20) {
                  handleChatHistory(page + 1);
                }
              }}
              onStartReachedThreshold={0}
              ListHeaderComponent={
                    loading ? <ActivityIndicator size="small" /> : null
                  }
              keyExtractor={(_, index) => index.toString()}
              ListEmptyComponent={<NoDataFound />}
              renderItem={({ item, index }) => (
                <>
                  {(index === 0 || item.date !== chat[index - 1]?.date) && (
                    <Text
                      style={{
                        
                        alignSelf: 'center',
                        marginVertical: 4,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor: theme,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'gray',
                        color:  themeColor.text,
                        overflow: 'hidden',
                      }}
                    >
                      {item.date}
                    </Text>
                  )}
                  <View
                    style={{
                      alignSelf:
                        item.from === auth?.mobile
                          ? 'flex-end'
                          : 'flex-start',
                      backgroundColor:
                        item.from === auth?.mobile ? '#d1d1d1' : '#add8e6',
                      marginStart: item.from === auth?.mobile ? 40 : 5,
                      marginEnd: item.from === auth?.mobile ? 5 : 40,
                      marginVertical: 5,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{item.message}</Text>
                    <Text style={{ fontSize: 10, color: 'gray' }}>
                      {item.time}
                    </Text>
                  </View>
                </>
              )}

                onScroll={(event) => {
                      const currentOffset = event.nativeEvent.contentOffset.y;

                      if (currentOffset > lastOffset.current) {
                        console.log("Scrolling DOWN");
                      } else {
                        console.log("Scrolling UP");
                        setIsAtBottom(false);
                      }
                      lastOffset.current = currentOffset;
                    }}
                    scrollEventThrottle={16}
            />
 
          <View
  style={{
        bottom: 0,

    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: themeColor.background,
  }}
>
    <View
      style={{
         padding: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: themeColor.chatSearch,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <TextInput
        placeholder="Type a message..."
        placeholderTextColor={themeColor.placeholder}
        value={message}
        onChangeText={setMessage}
        multiline
        returnKeyType="send"
        onSubmitEditing={sendMessage}
        style={{
          flex: 1,
          maxHeight: 100,
          fontSize: 16,
          color: themeColor.text,
          paddingVertical: 6,
        }}
      />

      <TouchableOpacity
        onPress={sendMessage}
        activeOpacity={0.7}
        style={{
          backgroundColor: message.trim()
            ? themeColor.tabBarActive || '#007AFF'
            : '#ccc',
          width: 38,
          height: 38,
          borderRadius: 19,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8,
        }}
        disabled={!message.trim()}
      >
        <Text style={{ color: themeColor.text, fontWeight: '600' }}>
          ➤
        </Text>
      </TouchableOpacity>
    </View>
</View>
    </View>
 </KeyboardAvoidingView>
  );
};

export default ChatHistoryUI;
