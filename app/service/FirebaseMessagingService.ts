import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  requestPermission,
  registerDeviceForRemoteMessages,
  onMessage,
  onTokenRefresh,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getAPNSToken,
} from '@react-native-firebase/messaging';

import {
  Platform,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';

import { log } from '../utils/helper';
import { navigate } from '../routes/navigationRef.ts';


class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;
  private fcmToken: string | null = null;
  private messaging = getMessaging(getApp());

  private constructor() {

  }

  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  // 🔐 iOS Permission
  public async requestIOSPermission(): Promise<boolean> {
    const authStatus = await requestPermission(this.messaging);

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  // 🔥 Init
  public async init(): Promise<string | null> {
    try {
      // 📱 Android 13+
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Notification Permission",
            "Please enable notification permission from settings.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return null;
        }
      }

      // 🍎 iOS
      if (Platform.OS === 'ios') {
      const hasPermission = await this.requestIOSPermission();
      if (!hasPermission) return null;

      // ✅ Wait for APNS token
      let apnsToken = await getAPNSToken(this.messaging);

      let retry = 0;
      while (!apnsToken && retry < 5) {
        await new Promise(res => setTimeout(()=> {res}, 1000));
        apnsToken = await getAPNSToken(this.messaging);
        retry++;
      }

      if (!apnsToken) {
        console.log("❌ APNS token not available");
        return "";
      }

      console.log("✅ APNS Token:", apnsToken);
      }

      // 🔑 Get Token
      this.fcmToken = await getToken(this.messaging);
      log(`${Platform.OS} FCM Token`, this.fcmToken);

      return this.fcmToken;
    } catch (error) {
      log('FCM Init Error:', error);
      return null;
    }
  }

  // 📦 Get stored token
  public getToken(): string | null {
    return this.fcmToken;
  }

  // 🔄 Token Refresh
  public listenTokenRefresh(): () => void {
    return onTokenRefresh(this.messaging, token => {
      this.fcmToken = token;
      log(`${Platform.OS} FCM Token refreshed`, token);
    });
  }

  // 📲 Foreground Listener
  public foregroundListener(): () => void {
    return onMessage(
      this.messaging,
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        Alert.alert(
          remoteMessage.notification?.title ?? '',
          remoteMessage.notification?.body ?? ''
        );
      }
    );
  }

  // 📩 Notification Open Handler
  public notificationOpenHandler(isNavigate : boolean = false): void {
    // Background → user taps
    onNotificationOpenedApp(this.messaging, remoteMessage => {
      log(`${Platform.OS} Opened from background`, remoteMessage);
        const screen = remoteMessage?.data?.screen;
                const userId = remoteMessage?.data?.userId;

                if (screen && isNavigate) {
                  navigate(screen);
                }
    });

    // Quit state
    getInitialNotification(this.messaging).then(remoteMessage => {
      if (remoteMessage) {
        log(`${Platform.OS} Opened from quit state`, JSON.stringify(remoteMessage));
          const screen = remoteMessage?.data?.screen;
                const userId = remoteMessage?.data?.userId;
                if (screen && isNavigate) {
                    navigate(screen);
                }
      }
    });
  }
}

export default FirebaseMessagingService.getInstance();
