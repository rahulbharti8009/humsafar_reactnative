import { BASE_URL } from "../utils/constant";

export class ENDPOINT {
  static BASE_URL = BASE_URL;

   static AUTH = {
    LOGIN: `/send-otp`,
    VERIFY_OTP: `/verify-otp`,
  };
    static PROFILE = {
   PROFILE_LIST : `/profileList`,
   PROFILE_DETAILS : `/save_profile`,
   PROFILR_PICTURE : `/profilePic`,
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
}
