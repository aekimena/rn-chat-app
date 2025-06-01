import React from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import {useAuthStore} from '../store/authStore';

const RootNavigator = () => {
  const {token} = useAuthStore();

  return token ? <MainNavigator /> : <AuthNavigator />;
};

export default RootNavigator;
