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
import { log } from '../../utils/helper';

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
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isAtBottom, setIsAtBottom] = useState(true);



  const paginationRef = useRef(false);

    /* ---------------- LOAD CHAT HISTORY ---------------- */
  const handleChatHistory = async (pageNumber = 1) => {
  if (isLoading || !hasMore || paginationRef.current) return;
      paginationRef.current = true;

  setLoading(true);

    try {
      const payload: ChatHistoryPayload = {
        name: `${auth?.email}-${user?.email}`,
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
      setChat(prev => [...(data.value || []), ...prev]);      }

      setHasMore(data.hasMore || false);
      setPage(pageNumber);
    }

          } catch (error) {
          console.log(error);
        } finally {
          paginationRef.current = false;  // ✅ unlock
          setLoading(false);
        }
  };
  /* ---------------- UNREAD / ONLINE STATUS ---------------- */

  const checkIsUnread=()=> {
    socket?.emit(`unread`, {
      sender : auth?.email,
      reciever : user.email,
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
    const socketParams = `message${auth?.email}-${user.email}`;

    socket?.on(socketParams, (msg: ChatMessage) => {
    setChat(prev => [...prev, msg]); // because inverted
      socket.emit('getchatList', {
        email : user.email
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
      socket?.off(`unread${user?.email}`)
    };
  }, [user.email]);

    /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = () => {
    if (!auth?.email || !message.trim()) return;

    const body: ChatMessage = {
      message: message.trim(),
      clientFrom: auth?.email,
      clientTo: user?.email,
      isUnread:isRecieverUnread,
    };

    socket?.emit('user-message', body);

    setMessage(()=> '');
  };

    /* ---------------- AUTO SCROLL TO BOTTOM ---------------- */

    // useEffect(() => {
     
    //   if (isAtBottom) {
    //       flatListRef.current?.scrollToEnd({
    //         animated: true,
    //       });
    //   }
    // }, [chat]);


  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  // keyboardVerticalOffset={20}
>
    <View style={{ backgroundColor: themeColor.background   , flex: 1}}>
          <CustomChattingHeader
        title={`${user?.email}`} name={`${user?.name}`} online={isRecieverUnread ? 'online': 'offline'}
      />
          <FlatList
              ref={flatListRef} 
              data={chat}
              style={{ flex: 1, padding: 10 }}
            //  onScroll={(event) => {
            //         const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

            //         const isBottom =
            //           layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

            //         const isTop = contentOffset.y <= 50;

            //         setIsAtBottom(isBottom);

            //         if (isTop && !isLoading && hasMore && !paginationRef.current) {
            //           handleChatHistory(page + 1);
            //         }
            //       }}
            //  scrollEventThrottle={16}

              onContentSizeChange={() => {
                log("","onContentSizeChange")
                if (isAtBottom) {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }
              }}
              
              showsVerticalScrollIndicator={false}
              // PAGGINATION
              onStartReached={() => {
              console.log('start reached');
               if(isAtBottom) return

              if (!isLoading && hasMore && !paginationRef.current && chat.length >= 20) {
                  handleChatHistory(page + 1);
                } 
              }}
              onStartReachedThreshold={0.3}
              // LOADING HEADER
              ListHeaderComponent={
                    isLoading ? <ActivityIndicator size="small" /> : null
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
                        item.clientFrom === auth?.email
                          ? 'flex-end'
                          : 'flex-start',
                      backgroundColor:
                      item.clientFrom === auth?.email ? '#d1d1d1' : '#add8e6',
                      marginStart: item.clientFrom === auth?.email ? 40 : 5,
                      marginEnd: item.clientFrom === auth?.email ? 5 : 40,
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
