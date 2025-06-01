import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Conversation} from '../../types';
import {commonStyles} from '../../constants/styles';
import {formatDateTime, getProfileImage} from '../../utils/helpers';
import {DisplayMissage} from './DisplayMissage';
import {theme} from '../../constants/colors';
import {useUserStore} from '../../store/userStore';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigation/screens';
import {fonts} from '../../constants/fonts';
import {useChatStore} from '../../store/chatStore';

export const ConversationItem = ({
  conversation: item,
}: {
  conversation: Conversation;
}) => {
  const navigation = useNavigation();
  const {user} = useUserStore();
  const {getUnreadCount} = useChatStore();
  const unreads = getUnreadCount(item.partner._id) || item.unreadCount;
  return (
    <Pressable
      style={{...commonStyles.flex, gap: 15, padding: 15}}
      onPress={() =>
        navigation.navigate(SCREENS.screenNav, {
          screen: SCREENS.chatScreen,
          params: {partnerId: item.partner._id},
        })
      }>
      <Image
        source={getProfileImage(item.partner.profileImage.url)}
        style={{height: 70, width: 70, borderRadius: 70}}
      />
      <View style={{flex: 1, gap: 5}}>
        <Text style={{...fonts['font-14-regular']}}>{item.partner.name}</Text>
        {item.isTyping ? (
          <Text style={{color: theme.primary}}>Typing...</Text>
        ) : (
          <DisplayMissage message={item.displayMessage} />
        )}
      </View>
      <View style={{alignItems: 'center', gap: 5}}>
        <Text style={{...fonts['font-12-regular']}}>
          {formatDateTime(item.displayMessage.createdAt)}
        </Text>
        {item.displayMessage.sender === user?._id ? (
          <></>
        ) : unreads > 0 ? (
          <View style={styles.unread}>
            <Text style={{color: '#fff', ...fonts['font-12-regular']}}>
              {unreads}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  unread: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: theme.primary,
    borderRadius: 20,
    ...commonStyles['items-center'],
  },
});
