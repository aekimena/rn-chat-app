import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {theme} from '../../constants/colors';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ChatParamList} from '../../types/navigation';
import {ChatHeader} from '../../components/conversation/ChatHeader';
import {ChatFooter} from '../../components/conversation/ChatFooter';
import {useChatStore} from '../../store/chatStore';
import {MessageBubble} from '../../components/message/MessageBubble';
import {useQuery} from '@tanstack/react-query';
import api from '../../api';
import {commonStyles} from '../../constants/styles';

const ChatScreen = () => {
  const route = useRoute<RouteProp<ChatParamList, 'chat-screen'>>();

  const {partnerId} = route.params;

  const {setMessages} = useChatStore();

  const {
    data: partnerData,
    isLoading: isPatnerLoading,
    isLoadingError: isPartnerError,
  } = useQuery({
    queryKey: ['partner', partnerId],
    queryFn: async () => {
      const response = await api.get(`/chat/partner/${partnerId}`);
      return response.data;
    },
    enabled: !!partnerId,
  });

  const partner = partnerData && partnerData.data ? partnerData.data : null;

  const {
    data: messageData,
    isLoading,
    isLoadingError,
  } = useQuery({
    queryKey: ['messages', partnerId],
    queryFn: async () => {
      const response = await api.get(`/chat/messages/${partnerId}`);
      return response.data;
    },
    enabled: !!partner,
  });

  useEffect(() => {
    if (messageData && Array.isArray(messageData.data) && partner) {
      console.log(messageData.data);

      setMessages(messageData.data, partner._id);
    }
  }, [messageData, partner]);

  const messages = partner
    ? useChatStore.getState().getMessages(partner._id) || []
    : [];
  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      {isPatnerLoading && (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.background,
            ...commonStyles['items-center'],
          }}>
          <ActivityIndicator />
        </View>
      )}
      {isPartnerError && <View></View>}
      {partner && !isPartnerError && !isPatnerLoading && (
        <>
          <ChatHeader partner={partner} />
          <FlatList
            data={messages}
            keyExtractor={item => item._id}
            renderItem={({item}) => <MessageBubble message={item} />}
            contentContainerStyle={styles.contentStyle}
          />
          <ChatFooter partner={partner} />
        </>
      )}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  contentStyle: {
    gap: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 100,
  },
});
