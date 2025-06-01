import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import ScreenNavigator from './ScreenNavigator';
import {useSocketStore} from '../store/socket.store';
import {useChatStore} from '../store/chatStore';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const {connectSocket} = useSocketStore();
  const {subscribeToNewMessage} = useChatStore();

  useEffect(() => {
    connectSocket();

    setTimeout(() => {
      subscribeToNewMessage();
    }, 500);
  }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="tabs" component={TabsNavigator} />
      <Stack.Screen name="screen-nav" component={ScreenNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
