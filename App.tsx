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

function AppContent() {
  const { theme , themeColor} = useTheme();
  const user = useAppSelector((state) => state.auth.user)

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
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
