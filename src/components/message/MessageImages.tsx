import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Message} from '../../types';
import {commonStyles} from '../../constants/styles';

export const MessageImages = ({message}: {message: Message}) => {
  const {images} = message;
  return (
    <View style={{...commonStyles.flex, gap: 5}}>
      {images.map((item, index) => (
        <Image
          key={index}
          source={{uri: item.url}}
          style={{height: 80, width: 80, borderRadius: 12}}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({});
