import React from "react";
import { TouchableOpacity } from "react-native";
import { MyCircle } from "../../../../component/MyCircle";
import { Icon } from "../../../../component/ImageComp";
import { useAppSelector } from "../../../../redux/hook/hook";
import { SOCKET_URL } from "../../../../utils/constant";

export const ProfileAvatar = ({ uri, themeColor }: { uri: string; themeColor: any }) => {
          const profile = useAppSelector(state => state.profile.profile);
  
  return (
    <MyCircle size={150} color={themeColor.profileSelecter}>
      <TouchableOpacity activeOpacity={0.8}>
        <Icon size={140} source={
           profile?.profileImages && profile?.profileImages?.uri ? { uri: `${SOCKET_URL}/${uri}` } : require('../../../../../assets/ic_user.png')} />
      </TouchableOpacity>
    </MyCircle>
  );
};