import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation';
import {StatusBar} from 'react-native';
import {theme} from './src/constants/colors';
import {NetInfoProvider} from './src/hooks/useNetInfo';
import {AuthProvider} from './src/hooks/useAuth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GOOGLE_WEB_ID} from './keys.config';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_ID,

  offlineAccess: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <NetInfoProvider>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar
                backgroundColor={theme.primary}
                barStyle="light-content"
              />
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </NetInfoProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
