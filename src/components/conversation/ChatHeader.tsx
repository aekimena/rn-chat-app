import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {User} from '../../types';
import {commonStyles} from '../../constants/styles';
import {getProfileImage} from '../../utils/helpers';
import {theme} from '../../constants/colors';
import {fonts} from '../../constants/fonts';
import {useChatStore} from '../../store/chatStore';
import {Icon} from '../Icon';

export const ChatHeader = ({partner}: {partner: User}) => {
  const {conversations} = useChatStore();
  const isTyping = conversations.find(
    i => i.members.includes(partner._id) && i.isTyping == true,
  );
  return (
    <View style={styles.container}>
      <Pressable>
        <Icon name="arrow-back" size={20} color={theme.text100} />
      </Pressable>
      <View style={{...commonStyles.flex, gap: 10}}>
        <Image
          source={getProfileImage(partner.profileImage.url)}
          style={{height: 50, width: 50, borderRadius: 70}}
        />
        <View style={{gap: 3}}>
          <Text style={{...fonts['font-14-regular']}}>{partner.name}</Text>
          {isTyping && <Text style={{color: theme.primary}}>Typing...</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex,
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: theme.border,
  },
});
