import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CustomInput} from '../inputs/CustomInput';
import {theme} from '../../constants/colors';
import {commonStyles} from '../../constants/styles';
import {useSendMessage} from '../../hooks/useSendMessage';
import {useUserStore} from '../../store/userStore';
import {User} from '../../types';

import {createTypingEmitter} from '../../utils/typingEmitter';
import {useSocketStore} from '../../store/socket.store';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export const ChatFooter = ({partner}: {partner: User}) => {
  const [inputText, setInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const {mutate: sendMessage} = useSendMessage();
  const {user} = useUserStore();
  const socket = useSocketStore.getState().socket;
  const emitTyping = useRef(createTypingEmitter(socket, partner._id)).current;

  const getModifiedImages = selectedImages.map(i => ({url: i}));

  const sendMessageFunc = () => {
    sendMessage({
      message: {
        _id: Date.now().toString(),
        text: inputText,
        images: getModifiedImages,
        placeholderId: Date.now().toString(),
        type: selectedImages.length > 0 ? 'picture-text' : 'text',
        status: 'queued',
        createdAt: new Date(),
        sender: user?._id,
        receiver: partner._id,
      },
      partner,
    });
    setSelectedImages([]);
    setInput('');
  };

  const onPressCamera = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      compressImageQuality: 1,
    }).then(selectedImage => {
      console.log(selectedImage.path);

      setSelectedImages([...selectedImages, selectedImage.path]);
    });
  };
  return (
    <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
      {selectedImages.length > 0 && (
        <View style={{...commonStyles.flex, gap: 15, marginBottom: 15}}>
          {selectedImages.map((item, index) => (
            <Image
              key={index}
              source={{uri: item}}
              style={{height: 80, width: 80, borderRadius: 12}}
            />
          ))}
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'flex-start',
        }}>
        <Pressable onPress={onPressCamera} style={styles.camera}>
          <Icon name="camera" size={20} color={theme.text100} />
        </Pressable>
        <View style={{flex: 1}}>
          <CustomInput
            placeholder="Start typing..."
            onChangeText={txt => {
              setInput(txt);
              emitTyping();
            }}
            defaultValue={inputText}
          />
        </View>

        <Pressable
          onPress={sendMessageFunc}
          disabled={!inputText.trim() && selectedImages.length === 0}
          style={{...styles.sendButton}}>
          <Icon name="paper-plane" size={20} color={'#fff'} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sendButton: {
    height: 45,
    width: 45,
    borderRadius: 45,
    backgroundColor: theme.primary,
    ...commonStyles['items-center'],
  },
  camera: {
    height: 45,
    width: 45,
    borderRadius: 45,
    backgroundColor: theme.card,
    ...commonStyles['items-center'],
  },
});
