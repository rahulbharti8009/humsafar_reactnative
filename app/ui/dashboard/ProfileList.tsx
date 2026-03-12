import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";
import { ImageEntity, ProfileEntity } from "../../types/profile.type";
import MySocket from "../../utils/socket";
import { useAppSelector } from "../../hook/hook";
import { postApi } from "../../types/genericType";
import { ENDPOINT } from "../../api/endpoint";
import { LoginPayload } from "../../types/auth";
import NoDataFound from "../../common/NoDataFound";
import { RouteName } from "../../utils/enum";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { useNavigation } from "@react-navigation/native";
import { ProfileCard } from "./component/ProfileCard";
import { log } from "../../utils/helper";
import { PreviewGallery } from "./component/PreviewGallery";

export type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.ChatTab>;
};

export default function ProfileListScreen() {
 const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppSelector((state) => state.auth.user)
  //
  const paginationRef = useRef(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [profileList, setProfileList] = React.useState<ProfileEntity[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
    const [previewGallery, setPreviewGallery] = useState<ImageEntity[]>([]);
const [showGallery, setShowGallery] = useState(false);

    useEffect(()=> {
    if(user != null && user.isProfileActive) {        
        profileApi(1);
    }
  },[user])

  const profileApi = async(pageNumber = 1)=> {
  if (isLoading || !hasMore || paginationRef.current) return;
    paginationRef.current = true;
    setLoading(true)
    
    try{
    const payload : LoginPayload={
      email: user?.email || "",
      page: pageNumber,
      limit: 20,
    }
        const profile = await postApi<ProfileEntity, LoginPayload>(
        ENDPOINT.PROFILE.PROFILE_LIST,
        payload 
        );

        if(profile.status && profile.value) {
         const newData = Array.isArray(profile.value)
        ? profile.value
        : [profile.value];

            if (pageNumber === 1) {
              setProfileList(newData);
            } else {
              setProfileList(prev => [...prev, ...newData]);
            }
         setHasMore(profile.hasMore || false);
         setPage(pageNumber);
        }
       } catch(error) {
       console.log(error);
      } finally{
        setLoading(false);
          paginationRef.current = false;  // ✅ unlock
          console.log('User count ',profileList.length); // ✅ log completion
          }
        }

if (user == null) return

  return (
     <>
      <FlatList
        style={{margin: 10}}
        data={profileList}
        keyExtractor={(item, index) => item.email || index.toString()}
        renderItem={({ item }) => <ProfileCard item={item} user={user}
        onPress={() => {

          const socket = MySocket.getInstance().getSocket();
          socket?.emit('readMsg', {
            sender: user?.email,
            reciever: item?.email
          });

          const handleReadMsg = () => {
            socket?.emit('getchatList', {
              email: user?.email
            });

            navigation.navigate(RouteName.ChatHistory, {
              user: {
                name: item?.personal?.name || "",
                email: item?.email || "",
              }
            });
          };
          socket?.on(`readMsg${user?.mobile}`, handleReadMsg);
        } } 
        onPreviewGalery={(image)=> {
        setPreviewGallery(image);
        setShowGallery(true); // ✅ open modal

        } }/>}
        showsVerticalScrollIndicator={false}
         // 🔥 PAGINATION
        onEndReached={() => {
          if (!isLoading && hasMore && profileList.length >= 20) {
            profileApi(page + 1);
          }
        }}
        onEndReachedThreshold={0.3}

         // 🔥 LOADING FOOTER
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" /> : null
        }

        refreshing={refreshing}   
        onRefresh={async () => {
          setHasMore(true);
             await profileApi(1);
          setRefreshing(false);
          }}  
        ListEmptyComponent={<NoDataFound />}
      />

      {previewGallery.length > 0 && (
        <PreviewGallery
          images={previewGallery}
          visible={showGallery}
          onClose={() => {
            setShowGallery(false)
            setPreviewGallery([])
          }}
        />
      )}
     </>
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