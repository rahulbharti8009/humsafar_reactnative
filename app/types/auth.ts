
export interface LoginPayload {
    email: string;
    otp?: string;
    page?: number;
    limit?: number;  
    fcmtoken?:string;
  }
  
  export interface Chat {
    email: string;
    mobile?: string;
    name?: string;
    last_message?: string;
    count?: number;
    color?: string;
    time?: string;
    date?: string;
    timestamp?: number;
  }
  export interface Invite {
    email: string;
    mobile: string;
    name: string;
    request_type: string;
    color: string;
    reject: string;
  }
  
  // User model
  export interface User {
    _id?: string;
    email: string;
    mobile: string;
    name: string;
    role?: string;
    isProfileActive?: boolean;
    isLocked?: boolean;
    isDeactivated?: boolean;
    createdAt: string;
    updatedAt: string;
    fcmToken: string;
    token?: string;

    __v: number;  
  }
 