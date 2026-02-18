import { BASE_URL } from "../utils/constant";

export class ENDPOINT {
  static BASE_URL = BASE_URL;

   static AUTH = {
    LOGIN: `/send-otp`,
    VERIFY_OTP: `/verify-otp`,

    // VERIFY_OTP: `${API.BASE_URL}/auth/verify-otp`,
    // RESEND_OTP: `${API.BASE_URL}/auth/resend-otp`,
  };
    static USER = {
    // PROFILE: `${API.BASE_URL}/user/profile`,
    // UPDATE_PROFILE: `${API.BASE_URL}/user/update`,
  };
}
