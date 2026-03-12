import React, {} from 'react';
import { RootStackParamList } from '../../utils/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteName } from '../../utils/enum';
import { ProfileScreen } from '../dashboard/ProfileScreen';

export type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Chat>;
};
export const Profile: React.FC<Props> = ({ navigation }) => {

  return (
      <ProfileScreen/>
  )
};

