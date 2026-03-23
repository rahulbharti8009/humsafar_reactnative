import { BASE_URL } from "../utils/constant";

export class ENDPOINT {
  static BASE_URL = BASE_URL;

   static AUTH = {
    LOGIN: `/send-otp`,
    VERIFY_OTP: `/verify-otp`,
  };
    static PROFILE = {
   PROFILE_LIST : `/profileList`,
   PROFILE_SAVE : `/save_profile`,
   PROFILR_PICTURE : `/profilePic`,
   PROFILE_DETAILS : `/profile`,
   DELETE_PROFILE_PIC : `/delete-image`,
  };

  static INVITE = {
   USER : `/invite_user`,
   INVITE_LIST : `/invite_list`,
   CHAT_LIST : `/chat_list`,
   REJECT_USER : `/reject_user`,
   ACCEPT_USER:'/accept_user',
  };
  static CHAT = {
    CHAT_HISTORY : `/chat/history`,
    SEND_MESSAGE : `/send_message`
  };
    static NOTIFICATION = {
       SEND:'/send_notification'
    }
}
