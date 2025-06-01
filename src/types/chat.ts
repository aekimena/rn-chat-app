import {User} from '.';

type Conversation = {
  members: [string, string];
  messages: Message[];
  displayMessage: Message;
  partner: User;
  isTyping: boolean;
  unreadCount: number;
};
type Message = {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  images: {url: string}[];
  type: 'text' | 'picture-text';
  status: 'sent' | 'delivered' | 'seen' | 'error' | 'queued';
  placeholderId: string;
  createdAt: Date;
};

export type {Conversation, Message};
