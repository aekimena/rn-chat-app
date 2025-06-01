// hooks/useSendMessage.ts
import {useMutation} from '@tanstack/react-query';
import {Message, User} from '../types';
import api from '../api';
import {useChatStore} from '../store/chatStore';

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({
      message,
      partner,
    }: {
      message: Message;
      partner: User;
    }) => {
      const formData = new FormData();
      formData.append('message', JSON.stringify(message));

      if (message.type == 'picture-text' && message.images?.length) {
        message.images.forEach((i, index) => {
          const fileExtension = i.url.split('.').pop(); // e.g., jpg, png
          formData.append('images', {
            uri: i.url,
            name: `image_${index}.${fileExtension}`,
            type: `image/${fileExtension}`, // fallback, you could also detect mime with alib
          });
        });
      }

      const response = await api.request({
        url: `/chat/send-message`,
        method: 'post',
        data: formData,
      });

      return response.data;
    },
    onMutate: async ({message, partner}) => {
      // Optimistic UI
      useChatStore.getState().addNewMessage(message, partner);
      // useQueuedMessagesStore.getState().addQueuedMessage(message);
    },
    onSuccess: (data, {message}) => {},
    onError: (error, {message}) => {
      console.error('Send message failed:', error);
    },
  });
};
