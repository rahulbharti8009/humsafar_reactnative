import { Chat, User } from "../types/auth";

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Users:undefined;
    Profile: undefined;
    ChatHistory : {user: Chat};
    AddGroupUI : undefined;
    VideoCall: {}
  };

  export type ChatUser = {
    _id: string;
    name: string;
    mobile?: string;
    image?: string;
    online ?: boolean;
    admin: string;
    group_user: GroupUser[];
    fcmToken : string;
    __v: number;
  };

// group
export interface GroupUser {
  _id: string;
  mobile: string;
}
  // Message Type
export interface ChatMessage {
  message: string;
  from : string,
  clientFrom: string;
  clientTo: string;
  date: string;
  time: string;
  fcmToken: string;
  isUnread: boolean;
}

export interface ChatHistoryPayload {
  name: string;
}

export interface ProfilePayload {
    mobile: string;
    name: string;
    color: string;

  }
  