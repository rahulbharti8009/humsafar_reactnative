import { Alert, Platform, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { MyStack } from './app/routes/stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/redux/store/store';
import { ThemeProvider, useTheme } from './app/theme/ThemeContext';
import { useAppSelector } from './app/redux/hook/hook';
import { DeepLinkProvider } from './app/theme/DeepLinkContext';
import FirebaseMessagingService from './app/service/FirebaseMessagingService';
import { useEffect } from 'react';
import { getLoginData } from './app/utils/localDB';
import { login } from './app/redux/slice/authSlice';


function AppContent() {
  const { theme , themeColor} = useTheme();
  const user = useAppSelector((state) => state.auth.user)
const dispatch = useDispatch();

  useEffect(() => {
    const initFCM = async () => {
      await FirebaseMessagingService.init();
       const savedUser = await getLoginData();
            if (savedUser) {
              dispatch(login(savedUser));
            }

      FirebaseMessagingService.listenTokenRefresh();
      FirebaseMessagingService.foregroundListener();
      FirebaseMessagingService.notificationOpenHandler(savedUser != null);
    };

    initFCM();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={[styles.container, { backgroundColor:  themeColor.statusbar }]} edges={['top', 'bottom']}>
        <MyStack />
      </SafeAreaView>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <DeepLinkProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ThemeProvider>
      </DeepLinkProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
