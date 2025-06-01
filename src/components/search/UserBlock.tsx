import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {User} from '../../types';
import {commonStyles} from '../../constants/styles';
import {getProfileImage} from '../../utils/helpers';
import {fonts} from '../../constants/fonts';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigation/screens';
import {theme} from '../../constants/colors';

export const UserBlock = ({item}: {item: User}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate(SCREENS.screenNav, {
          screen: SCREENS.chatScreen,
          params: {partnerId: item._id},
        });
      }}
      style={styles.flex}>
      <Image
        source={getProfileImage(item.profileImage.url)}
        style={{height: 70, width: 70, borderRadius: 70}}
      />
      <View>
        <Text style={{...fonts['font-14-regular']}}>{item.name}</Text>
        <Text style={{color: theme.text200}}>@{item.username}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flex: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    ...commonStyles.flex,
    gap: 10,
  },
});
