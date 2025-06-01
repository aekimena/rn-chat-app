import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from '../screens/chat/ChatScreen';

const Stack = createNativeStackNavigator();

const ScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="chat-screen"
        component={ChatScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default ScreenNavigator;

const styles = StyleSheet.create({});
