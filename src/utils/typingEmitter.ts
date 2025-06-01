// utils/typingEmitter.ts

import {useDebouncedCallback} from 'use-debounce';

let isTyping = false;

export const createTypingEmitter = (socket: any, partnerId: string) => {
  const emitStopTyping = useDebouncedCallback(() => {
    if (isTyping) {
      //   socket.emit('send-typing', {to: partnerId});
      socket.emit('send-typing', {isTyping: false, partnerId});
      isTyping = false;
    }
  }, 1500); // delay before sending stop typing

  const emitTyping = () => {
    if (!isTyping) {
      //   socket.emit('user:typing', {to: partnerId});
      socket.emit('send-typing', {isTyping: true, partnerId});
      isTyping = true;
    }
    emitStopTyping(); // reset debounce
  };

  return emitTyping;
};
