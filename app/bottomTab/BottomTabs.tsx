import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch } from 'react-redux';

import { DashboardScreen } from '../ui/dashboard/DashboardScreen';
import { ProfileScreen } from '../ui/dashboard/ProfileScreen';
import { InviteListScreen } from '../ui/chat/InviteList';
import { ChatListScreen } from '../ui/chat/ChatList';

import { getLoginData } from '../utils/localDB';
import { login } from '../redux/slice/authSlice';
import { useAppSelector } from '../hook/hook';
import MySocket from '../utils/socket';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../theme/ThemeContext';
import { Invite } from '../types/auth';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  const dispatch = useDispatch();
    const { theme , themeColor,notification ,setNotification } = useTheme();
    const [inviteList, setInviteList] = useState<Invite[]>([]);

  const user = useAppSelector(state => state.auth.user);

  // 🔹 Load login user from local storage
  useEffect(() => {
    const fetchData = async () => {
      const res = await getLoginData();
      if (res) dispatch(login(res));
    };
    fetchData();
  }, []);

useEffect((): (() => void) | void => {
  if (!user?.mobile) return;
  const mobile: string = user.mobile;
  const socket = MySocket.getInstance().connect(mobile);
    const invite_list: string = `invite_list${mobile}`;

  try {
    // 🔥 CONNECT LISTENERS
    const handleConnect = (): void => {
      console.log('✅ Connected:', socket.id);
      socket.emit('getInviteList', { mobile });
    };

    const handleDisconnect = (reason: string): void => {
      console.log('❌ Disconnected:', reason);
    };

    const handleConnectError = (error: Error): void => {
      console.log('🚨 Connection Error:', error.message);
    };

      const handleInviteList = (data: Invite[]): void => {
        setNotification(data.length > 0 ? data.length : 0);
            // setInviteList(data ?? []);
          };

     if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on(invite_list, handleInviteList);

      
    // 🔥 CLEANUP
    return (): void => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off(invite_list, handleInviteList);

      socket.disconnect();
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Unexpected error:', error.message);
    }
  }

}, [user?.mobile]);

  if (!user) return null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // ✅ Highlight Colors
        tabBarActiveTintColor: themeColor.tabBarActive,
        tabBarInactiveTintColor: themeColor.tabBarInactive,

      tabBarStyle: {
        backgroundColor: themeColor.tabBarBgColor,
        height: 70,
        borderTopWidth: 0,
        elevation: 10,          // Android shadow
        shadowColor: "#000",    // iOS shadow
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 5,
        paddingBottom: 8,
      },

      tabBarItemStyle: {
        marginVertical: 6,
        borderRadius: 16,
      },

      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },

        // tabBarActiveBackgroundColor: themeColor.background,

        // ✅ Dynamic Icons
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Invite') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Ionicons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{ title: 'Chat' }}
      />

      <Tab.Screen
        name="Invite"
        component={InviteListScreen}
         options={{
          title: 'Invite',
          tabBarBadge: notification > 0 ? notification : undefined,
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: 12,
          },
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};