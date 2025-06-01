// src/screens/auth/LoginScreen.tsx
import React from 'react';
import {View, Button, StyleSheet, Text} from 'react-native';
import {useAuth} from '../../hooks/useAuth';
import {theme} from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamsList} from '../../types/navigation';

const LoginScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<AuthStackParamsList, 'login'>;
}) => {
  const {handleGoogleLogin, isLoading} = useAuth();

  return (
    <View style={styles.container}>
      <Button
        title="Login with Google"
        onPress={handleGoogleLogin}
        disabled={isLoading}
      />
      <View style={{position: 'absolute', bottom: 20}}>
        <Text onPress={() => navigation.navigate('signup')}>
          Don't have an account? Sign up
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
});

export default LoginScreen;
