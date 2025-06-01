import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {theme} from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamsList} from '../../types/navigation';

const OnboardingScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<AuthStackParamsList, 'onboarding'>;
}) => {
  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          paddingHorizontal: 20,
          width: '100%',
        }}>
        <Button title="Proceed" onPress={() => navigation.navigate('login')} />
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({});
