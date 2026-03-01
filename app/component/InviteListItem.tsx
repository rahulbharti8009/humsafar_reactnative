import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Invite, User } from '../types/auth';
import { useTheme } from '../theme/ThemeContext';
import { MyCircle } from './MyCircle';

export const InviteListItem: React.FC<{mobile? : string, user: Invite ,  onPress: (requestType: string) => void }> = ({mobile, user, onPress }) => {
    const scheme = useColorScheme(); // "light" or "dark"
    const { theme, toggleTheme, themeColor } = useTheme();

  return (
 <View style={[styles.container, { backgroundColor: themeColor.listitem }]}>
  
  {/* LEFT SECTION */}
  <View style={styles.leftSection}>
    
    <MyCircle color={user.color}>
      <Text style={[styles.avatarText, { color: themeColor.text }]}>
        {user.mobile?.[0]}
      </Text>
    </MyCircle>

    <View style={styles.userInfo}>
      {!!user?.name && (
        <Text
          numberOfLines={1}
          style={[styles.name, { color: themeColor.text }]}>
          {user.name}
        </Text>
      )}

      {/* <Text style={[styles.mobile, { color: themeColor.text }]}>
        {user.mobile === mobile ? `Self • ${user.mobile}` : user.mobile}
      </Text> */}
    </View>

  </View>

  {/* RIGHT SECTION */}
  <View style={styles.actionContainer}>
    
    <TouchableOpacity
      style={[styles.button, styles.rejectBtn]}
      onPress={() => onPress('REJECT')}
      activeOpacity={0.7}>
      <Text style={styles.btnText}>REJECT</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.acceptBtn]}
      onPress={() => onPress('ACCEPT')}
      activeOpacity={0.7}>
      <Text style={styles.btnText}>ACCEPT</Text>
    </TouchableOpacity>

  </View>

</View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userInfo: {
    marginLeft: 10,
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  mobile: {
    fontSize: 13,
    opacity: 0.7,
  },

  avatarText: {
    fontWeight: 'bold',
  },

  actionContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },

  button: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
    minWidth: 80,
    alignItems: 'center',
  },

  rejectBtn: {
    backgroundColor: '#FF3B30',
  },

  acceptBtn: {
    backgroundColor: '#1A700D',
  },

  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});