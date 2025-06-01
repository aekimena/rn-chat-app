// src/hooks/useAuth.ts

import {useQueryClient} from '@tanstack/react-query';
import {useAuthStore} from '../store/authStore';
import {loginWithGoogle, signupWithGoogle} from '../api/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoadingScreen} from '../components/common/LoadingScreen';
import {useUserStore} from '../store/userStore';
import {Alert} from 'react-native';
import {useChatStore} from '../store/chatStore';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const {token, setToken, clearToken} = useAuthStore();
  const {user, setUser, clearUser} = useUserStore();
  const {clearConversations} = useChatStore();

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo.data;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      const response = await loginWithGoogle(idToken);
      const {token, data} = response;

      setToken(token);
      setUser(data);
      console.log(response);
    } catch (error) {
      console.error('Google login error:', error);
      await GoogleSignin.signOut();
      Alert.alert('Login error!');
      throw error;
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo.data;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      const response = await signupWithGoogle(idToken);
      const {token, data} = response;

      setToken(token);
      setUser(data);
      console.log(response);
    } catch (error) {
      console.error('Google signup error:', error);
      await GoogleSignin.signOut();
      Alert.alert('Sign up error!');
      throw error;
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      clearToken();
      clearUser();
      queryClient.clear();
      clearConversations();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user: user,
    isLoading: false,
    isAuthenticated: !!token,
    handleGoogleLogin,
    handleGoogleSignup,
    logout,
  };
};

// Auth Provider Component
export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const {isLoading} = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
