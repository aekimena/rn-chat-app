import {SCREENS} from '../navigation/screens';

type AuthStackParamsList = {
  [SCREENS.login]: undefined;
  [SCREENS.signup]: undefined;
  [SCREENS.onboarding]: undefined;
};

type ChatParamList = {
  [SCREENS.chatScreen]: {partnerId: string};
};
type MainTabParamList = {};

export type {AuthStackParamsList, MainTabParamList, ChatParamList};
