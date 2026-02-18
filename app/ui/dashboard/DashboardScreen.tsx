import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { getLoginData } from '../../utils/localDB'
import { User } from '../../types/auth';

export const DashboardScreen = () => {
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await getLoginData().then(res => {
        console.log("DashboardScreen", res);
        setUser(res);
      });
    };
    fetchData();
  }, [])
  return (
    <View>
              <Text>{`email is ${user?.email}`}</Text>
    </View>
  )
}
