import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SOCKET_URL } from "../../../utils/constant";
import { ProfileEntity } from "../../../types/profile.type";
import MySocket from "../../../utils/socket";
import { useAppSelector } from "../../../hook/hook";
import { postApi } from "../../../types/genericType";
import { ENDPOINT } from "../../../api/endpoint";
import { User } from "../../../types/auth";
import { useTheme } from "../../../theme/ThemeContext";
import NoDataFound from "../../../common/NoDataFound";
import { MyCircle } from "../../../component/MyCircle";
import { RouteName } from "../../../utils/enum";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../utils/types";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "../../../component/ImageComp";

const data = [
  {
    _id: "1",
    personal: {
      name: "Rahul Bharti",
      height: "5.6",
      religion: "Hindu",
      caste: "Brahmin",
      city: "New Delhi",
    },
    education: "MCA",
    job: "Doctor",
    income: "10-15 LPA",
  },
];

const ProfileCard  :React.FC<{item: ProfileEntity ,  user: User | null, onPress: () => void }> = ({item, user, onPress })=> {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [requestType, setRequestType] = useState<string>(item.requestType || '');

                  const inviteUserApi=async()=> {
                       const socket = MySocket.getInstance().getSocket();
                    if (!socket?.connected) socket?.connect();
                                  //add 
                        socket?.emit('inviteuser', {
                          sender: user?.mobile,
                          reciever : item.email,
                          name : user?.name,
                          mobile : user?.mobile,
                          request_type: 'accept',
                          color: user?.color
                        });
                        // recieve 
                          const handleInviteUser = (data: User[]) => {
                          socket?.emit('getInviteList', { mobile: item.email})
                           setRequestType('pending')
                          };
                          socket?.on('invite_user', handleInviteUser);
                      //   const payload = {
                      //       sender: user?.mobile,
                      //       reciever : item.email,
                      //       name : user?.name,
                      //       mobile : user?.mobile,
                      //       request_type: 'accept',
                      //       color: user?.color
                      //   }
                      // setLoading(prev => prev = true)
                      // const res = await postApi<ProfileEntity, any>(
                      //   ENDPOINT.INVITE.USER,
                      //   payload 
                      // );
                      // setLoading(prev => prev = false)
                      // if(res.status) {
                      //   setRequestType('pending')
                      // }

                  }

  const { theme , themeColor } = useTheme();

  const getColorType =()=> {
  if(requestType == 'invite') return '#2E3CFF'
  if(requestType == 'pending') return '#8d8888'
  if(requestType == 'accepted') return '#8f9190'
  return '#065912'
}
  return (
    <View style={styles.card}>
      <ImageBackground
          source={
            item?.profileImages
              ? { uri: `${SOCKET_URL}/${item?.profileImages.url}` }
              : require("../../../../assets/ic_profile.png") 
          }    
      style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
       <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.overlay}
          >
              {
            item.gallery && item.gallery?.length > 0 && <TouchableOpacity onPress={inviteUserApi}  style={[styles.request,{position:'absolute', right: 10, top: 10}]}  activeOpacity={0.7}>
             <Text style={[styles.mobile, {color: themeColor.text}]}>{`Gallery ${item.gallery?.length}`}</Text>
            </TouchableOpacity> 
          }
            <View style={{ padding: 12}}>
                 <Text style={styles.name}>
            {item.personal?.name}, {item.personal?.age} {item.personal?.gender}
          </Text>

          <Text style={styles.details}>
            {item.job} • {item.education} • {item.personal?.city}
          </Text>

          <Text style={styles.tags}>
            {item.personal?.height} ft | {item.personal?.religion} |{" "}
            {item.personal?.caste}
          </Text>

          <Text style={styles.income}>{`Income ${item.income} `}</Text>
      
          {
            requestType === 'invite' && <TouchableOpacity onPress={inviteUserApi}  style={[styles.request,{position:'absolute', right: 10, bottom: 10, backgroundColor:getColorType()}]}  activeOpacity={0.7}>
             <Text style={[styles.mobile, {color: (item.requestType === 'invite'    ) ? '#ffffff' : '#000000'}]}>{item.requestType}</Text>
            </TouchableOpacity> 
          }
          {
            requestType === 'pending' && <TouchableOpacity onPress={onPress}  style={[styles.request,{position:'absolute', right: 10, bottom: 10}]}  activeOpacity={0.7}>
              <Text style={[styles.mobile, {color: (item.requestType === 'pending') ? '#ffffff' : '#000000'}]}>{requestType}</Text>
            </TouchableOpacity> 
          }
  
            {
            requestType === 'accepted' && <TouchableOpacity onPress={onPress}  style={[{position:'absolute', right: 0, bottom: 10}]}  activeOpacity={0.7}>
                                            <Icon
                                              size={50}
                                              tintColor={themeColor.chat}
                                              margin={10}
                                              source={
                                                     require("../../../../assets/ic_chat.png")
                                                    }
                                            />
            </TouchableOpacity> 
          }
            </View>

        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.ChatTab>;
};

export default function ProfileListScreen({profileList ,onRefresh , refreshing }: {profileList: ProfileEntity[] , refreshing: boolean, onRefresh: () => void }) {
 const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppSelector((state) => state.auth.user)

  return (
      <FlatList
        style={{margin: 10}}
        data={profileList}
        keyExtractor={(item, index) => item.email || index.toString()}
        renderItem={({ item }) => <ProfileCard item={item}  user={user} onPress={() => {

            const socket = MySocket.getInstance().getSocket();
                      socket?.emit('readMsg', {
                      sender : user?.mobile,
                      reciever : item?.email
                    });

                    const handleReadMsg = () => {
                      console.log('read mesg');
                      socket?.emit('getchatList', {
                        mobile : user?.mobile
                      });
            navigation.navigate(RouteName.ChatHistory, {
                user: {
                  name: item?.personal?.name || "",
                  mobile: item?.email || "",
                  last_message: "",
                  count: 0,
                  color: "#2E3CFF",
                  time: "",
                  date: "",
                  timestamp: Date.now(),
                }
              });                     };
                    socket?.on(`readMsg${user?.mobile}`, handleReadMsg);

             
        }}/>}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}   
        onRefresh={onRefresh}  
        ListEmptyComponent={<NoDataFound />}
      />
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
  },

  image: {
    width: '100%',
    height: 320,
    justifyContent: "flex-end",
  },

  overlay: {
    justifyContent: "flex-end",
    height: "100%",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  details: {
    color: "#eee",
    fontSize: 14,
    marginTop: 2,
  },

  tags: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 4,
  },

  income: {
    color: "#719b72",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
   request:{
    backgroundColor: '#E5DDDE',
    marginLeft:10,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
   mobile: {
    color: '#555',
  },
});