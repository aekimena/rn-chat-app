import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {theme} from '../../constants/colors';
import {fonts} from '../../constants/fonts';

export const CustomInput = ({
  onChangeText,
  placeholder,
  defaultValue,
  label,
  disabled,
}: {
  onChangeText: (val: string) => void;
  placeholder: string;
  defaultValue?: string;
  disabled?: boolean;
  label?: string;
}) => {
  return (
    <View style={{gap: 5}}>
      {label && <Text style={{...fonts['font-12-regular']}}>{label}</Text>}
      <TextInput
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.text100}
        defaultValue={defaultValue}
        editable={!disabled}
        style={styles.textinput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textinput: {
    height: 45,
    width: '100%',
    borderRadius: 12,
    backgroundColor: theme.card,
    paddingHorizontal: 15,
    color: theme.text100,
  },
});
