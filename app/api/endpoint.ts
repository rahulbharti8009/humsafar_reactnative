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
}
