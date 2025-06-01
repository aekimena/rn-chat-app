// src/screens/auth/LoginScreen.tsx
import React from 'react';
import {View, Button, StyleSheet, Text} from 'react-native';
import {useAuth} from '../../hooks/useAuth';
import {theme} from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamsList} from '../../types/navigation';

const SignUpScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<AuthStackParamsList, 'signup'>;
}) => {
  const {handleGoogleSignup, isLoading} = useAuth();

  return (
    <View style={styles.container}>
      <Button
        title="Sign up with Google"
        onPress={handleGoogleSignup}
        disabled={isLoading}
      />
      <View style={{position: 'absolute', bottom: 20}}>
        <Text onPress={() => navigation.navigate('login')}>
          Already have an account? Login
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

export default SignUpScreen;
