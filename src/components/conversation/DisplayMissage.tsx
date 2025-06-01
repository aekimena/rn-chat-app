import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Message} from '../../types';
import {commonStyles} from '../../constants/styles';

export const DisplayMissage = ({message}: {message: Message}) => {
  if (message.type == 'picture-text') {
    return (
      <View style={{...commonStyles.flex, gap: 5}}>
        <Text>Photo</Text>
      </View>
    );
  }
  return <Text numberOfLines={1}>{message.text}</Text>;
};

const styles = StyleSheet.create({});
