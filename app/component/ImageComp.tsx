import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

interface IconProps {
  source: ImageSourcePropType;
  size?: number;
  radius?: number;
  padding?:number;
  margin?:number;
  borderWidth?:number;
  tintColor?: string;
  style?: StyleProp<ImageStyle>;
}

export const Icon: React.FC<IconProps> = ({
  source,
  size = 24,
  tintColor,
  style,
  radius = 12,
  padding = 0,
  margin,
  borderWidth

}) => {
  return (
    <Image
      source={source}
      style={[
        {
          width: size,
          height: size,
          tintColor,
          borderRadius: size/2,
          borderWidth: borderWidth,
          padding:padding,
          margin
        },
        style,
      ]}
    />
  );
};
