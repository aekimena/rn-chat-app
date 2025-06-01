// src/hooks/useNetInfo.ts
import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

import api from '../api';
import {StyleSheet, Text, View} from 'react-native';

export const useNetInfo = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // Check network status and set up listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Set up axios interceptors for offline handling
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      if (!isConnected) {
        throw new Error('No internet connection');
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [isConnected]);

  return {
    isConnected,
  };
};

// NetInfo Provider Component
export const NetInfoProvider = ({children}: {children: React.ReactNode}) => {
  const {isConnected} = useNetInfo(); // Initialize network monitoring
  return (
    <>
      {!isConnected && (
        <View style={styles.onNet}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
            }}>
            No internet connection...
          </Text>
        </View>
      )}
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  onNet: {
    height: 50,
    width: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
  },
});
