import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {theme} from '../../constants/colors';
import {useChatStore} from '../../store/chatStore';
import {ConversationItem} from '../../components/conversation/ConversationItem';
import {CustomInput} from '../../components/inputs/CustomInput';
import {useQuery} from '@tanstack/react-query';
import api from '../../api';

const HomeScreen = () => {
  const {conversations, setConversations} = useChatStore();

  const {
    data: convoData,
    isLoading,
    isLoadingError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['convos'],
    queryFn: async () => {
      const response = await api.get(`/chat/conversations`);
      return response.data;
    },
  });

  useEffect(() => {
    if (convoData && Array.isArray(convoData.data)) {
      setConversations(convoData.data);
    }
  }, [convoData]);
  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isLoading}
            onRefresh={refetch}
          />
        }
        ListHeaderComponent={
          <View style={{paddingHorizontal: 20}}>
            <CustomInput placeholder="Search conversation..." />
          </View>
        }
        contentContainerStyle={{marginTop: 20}}
        data={conversations}
        keyExtractor={item => `${JSON.stringify(item.members)}`}
        renderItem={({item}) => <ConversationItem conversation={item} />}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
