import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Conversation, Message} from '../types/chat';

import {User} from '../types';
import {useSocketStore} from './socket.store';
import {setTypingTimeout} from '../utils/typingTimeoutManager';
import {useUserStore} from './userStore';

type StoreState = {
  conversations: Conversation[];
  setConversations: (value: Conversation[]) => void;
  setMessages: (messages: Message[], partnerId: string) => void;
  getMessages: (partnerId: string) => Message[];
  addNewMessage: (value: Message, partner: User) => void;
  getUnreadCount: (partnerId: string) => number | undefined;
  subscribeToNewMessage: () => void;
  subscribeToTyping: () => void;
  sendTyping: (typing: boolean, partnerId: string) => void;
  getAllUnreadCount: () => number;
  clearConversations: () => void;
};

export const useChatStore = create<StoreState>((set, get) => ({
  conversations: [],
  clearConversations: () => {
    set({conversations: []});
  },
  // setConversations: newConversations => set({conversations: newConversations}),
  setConversations: conversations => {
    set(state => {
      // Merge existing conversations with new ones, avoiding duplicates
      const mergedConversations = [...state.conversations];

      conversations.forEach(newConv => {
        const existingIndex = mergedConversations.findIndex(
          conv =>
            (conv.members[0] === newConv.members[0] &&
              conv.members[1] === newConv.members[1]) ||
            (conv.members[0] === newConv.members[1] &&
              conv.members[1] === newConv.members[0]),
        );

        if (existingIndex >= 0) {
          // Keep existing messages but update other fields
          mergedConversations[existingIndex] = {
            ...newConv,
            messages: mergedConversations[existingIndex].messages || [],
          };
        } else {
          mergedConversations.push(newConv);
        }
      });

      // Sort by displayMessage createdAt (newest first)
      mergedConversations.sort(
        (a, b) =>
          new Date(b.displayMessage.createdAt).getTime() -
          new Date(a.displayMessage.createdAt).getTime(),
      );

      return {conversations: mergedConversations};
    });
  },

  setMessages: (messages, partnerId) => {
    set(state => {
      const updatedConversations = [...state.conversations];
      const convIndex = updatedConversations.findIndex(conv =>
        conv.members.includes(partnerId),
      );

      if (convIndex >= 0) {
        // Merge existing messages with new ones, avoiding duplicates
        const existingMessages = updatedConversations[convIndex].messages || [];
        const messageMap = new Map(existingMessages.map(msg => [msg._id, msg]));

        messages.forEach(msg => {
          messageMap.set(msg._id, msg);
        });

        updatedConversations[convIndex].messages = Array.from(
          messageMap.values(),
        ).sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      }

      return {conversations: updatedConversations};
    });
  },

  getMessages: partnerId => {
    const conversation = get().conversations.find(conv =>
      conv.members.includes(partnerId),
    );
    return conversation?.messages || [];
  },

  addNewMessage: (message, partner) => {
    const partnerId = partner._id;
    set(state => {
      const updatedConversations = state.conversations.map(conv => {
        if (conv.members.includes(partnerId)) {
          // Check if a message with the same placeholderId exists
          const updatedMessages = conv.messages.some(
            m => m.placeholderId === message.placeholderId,
          )
            ? conv.messages.map(m =>
                m.placeholderId === message.placeholderId ? message : m,
              )
            : [...conv.messages, message];

          return {
            ...conv,
            messages: updatedMessages,
            displayMessage: message, // Update the last message
          };
        }
        return conv;
      });

      // If conversation doesn't exist, create a new one
      if (
        !updatedConversations.some(conv => conv.members.includes(partnerId))
      ) {
        const newConversation: Conversation = {
          members: [message.sender, message.receiver],
          messages: [message],
          displayMessage: message,
          partner,
          isTyping: false,
        };
        updatedConversations.push(newConversation);
      }

      // Sort conversations by displayMessage.createdAt (newest first)
      const sortedConversations = [...updatedConversations].sort((a, b) => {
        const dateA = new Date(a.displayMessage.createdAt).getTime();
        const dateB = new Date(b.displayMessage.createdAt).getTime();
        return dateB - dateA; // For descending order (newest first)
      });

      return {conversations: sortedConversations};
    });
  },

  subscribeToNewMessage: () => {
    const socket = useSocketStore.getState().socket;

    if (socket) {
      socket.on('new-message', (data: {message: Message; partner: User}) => {
        console.log(data);

        get().addNewMessage(data.message, data.partner);
      });
    }
  },

  getUnreadCount: partnerId => {
    const conversation = get().conversations.find(conv =>
      conv.members.includes(partnerId),
    );
    if (!conversation) return undefined;

    // Assuming unread messages are those not seen by the current user
    // You'll need to know the current user's ID to implement this properly
    const currentUserId = 'current-user-id'; // Replace with actual current user ID
    return conversation.messages.filter(
      msg => msg.receiver === currentUserId && msg.status !== 'seen',
    ).length;
  },
  subscribeToTyping: () => {
    const socket = useSocketStore.getState().socket;
    if (socket) {
      socket.on(
        'receive-typing',
        (data: {partnerId: string; isTyping: boolean}) => {
          set(state => ({
            conversations: state.conversations.map(c =>
              c.members.includes(data.partnerId)
                ? {...c, isTyping: data.isTyping}
                : c,
            ),
          }));

          // Auto-clear after 5 seconds if no update
          setTypingTimeout(data.partnerId, partnerId => {
            set(state => ({
              conversations: state.conversations.map(c =>
                c.members.includes(partnerId) ? {...c, isTyping: false} : c,
              ),
            }));
          });
        },
      );
    }
  },
  sendTyping: (isTyping, partnerId) => {
    const socket = useSocketStore.getState().socket;
    if (socket) {
      socket.emit('send-typing', {isTyping, partnerId});
    }
  },
  getAllUnreadCount: () => {
    const {conversations} = get();
    const currentUserId = useUserStore.getState().user?._id;

    return conversations.reduce((total, conversation) => {
      // Skip if conversation has no unread messages
      if (conversation.unreadCount === 0) return total;

      // Case 1: Messages are loaded - calculate from actual messages
      if (conversation.messages?.length > 0) {
        const unreadInConversation = conversation.messages.filter(
          message =>
            message.status !== 'seen' && message.sender !== currentUserId,
          //  &&
          // (!message.status || message.status !== '')
        ).length;
        return total + unreadInConversation;
      }

      // Case 2: No messages loaded - use the pre-calculated unreadCount
      return total + (conversation.unreadCount || 0);
    }, 0);
  },
}));
