
export interface LoginPayload {
    email: string;
    otp?: string;
  }
  
  export interface Chat {
    mobile: string;
    name: string;
    last_message: string;
    count: number;
    color: string;
    time: string;
    date: string;
    timestamp: number;
  }
  export interface Invite {
    mobile: string;
    name: string;
    request_type: string;
    color: string;
    reject: string;
  }
  
  // User model
  export interface User {
    _id: string;
    email: string;
    status : boolean
    name: string;
    chat: Chat[];
    invite: Invite[];
    requestType: string;
    createdAt: string;
    updatedAt: string;
    message: string;
    fcmToken: string;
    __v: number;  
  }
  
  export interface LoginResponse {
    status: boolean;
    message: string;
    value: User;
  }

  export interface UserResponse {
    status: boolean;
    message: string;
    value: User[];
  }