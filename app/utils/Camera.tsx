
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export const pickFromCamera = ({ imageType, callback }: any) => {
  launchCamera(
    {
      mediaType: 'photo',
      cameraType: 'front',
      quality: 0.8,
    },
    (response) => {
      if (response.didCancel || response.errorCode) return;

      const uri = response.assets?.[0]?.uri;
      if (uri) callback(imageType, uri);
    }
  );
};

export const pickFromGallery = ({ imageType, callback }: any) => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 0.8,
    },
    (response) => {
      if (response.didCancel || response.errorCode) return;

      const uri = response.assets?.[0]?.uri;
      if (uri) callback(imageType, uri);
    }
  );
};

export const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') return true;

  const permissions = [
    PermissionsAndroid.PERMISSIONS.CAMERA,
    Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ];

  const result = await PermissionsAndroid.requestMultiple(permissions);

  return Object.values(result).every(
    (status) => status === PermissionsAndroid.RESULTS.GRANTED
  );
};
export const openPicker = async ({ imageType, callback }: any) => {
  const hasPermission = await requestCameraPermission();

  if (!hasPermission) {
    Alert.alert("Permission denied");
    return;
  }

  Alert.alert("Select Photo", "Choose an option", [
    {
      text: "Camera",
      onPress: () => pickFromCamera({ imageType, callback }),
    },
    {
      text: "Gallery",
      onPress: () => pickFromGallery({ imageType, callback }),
    },
    { text: "Cancel", style: "cancel" },
  ]);
};