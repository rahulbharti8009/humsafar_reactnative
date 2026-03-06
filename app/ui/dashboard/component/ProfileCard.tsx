import { useState } from "react";
import { User } from "../../../types/auth";
import { ProfileEntity } from "../../../types/profile.type";
import MySocket from "../../../utils/socket";
import { useTheme } from "../../../theme/ThemeContext";
import { ImageBackground, TouchableOpacity, View , Text, StyleSheet} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { Icon } from "../../../component/ImageComp";
import { SOCKET_URL } from "../../../utils/constant";
import { postApi } from "../../../types/genericType";
import { ENDPOINT } from "../../../api/endpoint";
import { log } from "../../../utils/helper";
const tag = "ProfileCard";
export const ProfileCard  :React.FC<{item: ProfileEntity ,  user: User | null, onPress: () => void }> = ({item, user, onPress })=> {
  const [isLoading, setLoading] = useState<boolean>(false);

    const [requestType, setRequestType] = useState<string>(item.requestType || '');

                  const inviteUserApi=async()=> {
                    //    const socket = MySocket.getInstance().getSocket();
                    // if (!socket?.connected) socket?.connect();
                    //               //add 
                    //     socket?.emit('inviteuser', {
                //    reciever : item.email,
                //             name : user?.name,
                //             email : user?.email,
                    //     });
                    //     // recieve 
                    //       const handleInviteUser = (data: User[]) => {
                    //       socket?.emit('getInviteList', { mobile: item.email})
                    //        setRequestType('pending')
                    //       };
                    //       socket?.on('invite_user', handleInviteUser);
                    try {

                        const payload = {
                            reciever : item.email,
                            name : user?.name,
                            email : user?.email,
                        }
                      setLoading(prev => prev = true)
                      const res = await postApi<ProfileEntity, any>(
                        ENDPOINT.INVITE.USER,
                        payload 
                      );
                      if(res.status) {
                        setRequestType('pending')
                      }
                    }catch(error) {
                        log(tag , error);
                    }finally {
                      setLoading(prev => prev = false)
                    }
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
            item.gallery && item.gallery?.length > 0 && <TouchableOpacity onPress={()=> {
                
            }}  style={[styles.request,{position:'absolute', right: 10, top: 10}]}  activeOpacity={0.7}>
             <Text style={[styles.mobile, {color: themeColor.text}]}>{`Gallery ${item.gallery?.length}`}</Text>
            </TouchableOpacity> 
          }
            <View style={{ padding: 12}}>
                 <Text style={styles.name}>
            {item.personal?.name} • {item.personal?.age} {item.email}
          </Text>

          <Text style={styles.details}>
            {item.job} • {item.education} • {item.personal?.city} • {item.personal?.state} • India
          </Text>

          <Text style={styles.tags}>
            {item.personal?.height} ft | {item.personal?.religion} | {item.personal?.caste}
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
            requestType === 'accepted' && <TouchableOpacity onPress={onPress}  style={[{position:'absolute', right: 0, bottom: 0}]}  activeOpacity={0.7}>
                                            <Icon
                                              size={40}
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