import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useUserStore} from '../../store/userStore';
import {Message} from '../../types';
import {theme} from '../../constants/colors';
import {BubbleFooter} from './BubbleFooter';
import {MessageImages} from './MessageImages';

export const MessageBubble = ({message}: {message: Message}) => {
  const {user} = useUserStore();
  return (
    <View
      style={{
        alignSelf: message.sender === user?._id ? 'flex-end' : 'flex-start',
        gap: 3,
      }}>
      <View
        style={{
          backgroundColor:
            message.sender === user?._id ? theme.primary : theme.card,
          ...styles.bubble,
        }}>
        {message.type == 'picture-text' && message.images.length > 0 && (
          <MessageImages message={message} />
        )}
        <Text
          style={{
            color: message.sender === user?._id ? theme.white : theme.text100,
          }}>
          {message.text}
        </Text>
      </View>
      <BubbleFooter message={message} />
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: '90%',
    minWidth: 100,

    gap: 10,
  },
});
