import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Message} from '../../types';
import {useUserStore} from '../../store/userStore';
import {formatTime} from '../../utils/helpers';
import {commonStyles} from '../../constants/styles';
import {fonts} from '../../constants/fonts';
import {Icon} from '../Icon';
import {theme} from '../../constants/colors';

export const BubbleFooter = ({message}: {message: Message}) => {
  const {user} = useUserStore();

  if (message.sender === user?._id) {
    return (
      <View style={{alignSelf: 'flex-end', ...commonStyles.flex, gap: 5}}>
        <Text style={{...fonts['font-12-regular']}}>
          {formatTime(message.createdAt)}
        </Text>
        {message.status === 'queued' && (
          <Icon name="time-outline" size={15} color={theme.text100} />
        )}
        {message.status === 'sent' && (
          <Icon name="checkmark-done-outline" size={15} color={theme.text100} />
        )}
      </View>
    );
  }
  return (
    <Text style={{...fonts['font-12-regular']}}>
      {formatTime(message.createdAt)}
    </Text>
  );
};

const styles = StyleSheet.create({});
