import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {theme} from '../../constants/colors';
import {CustomInput} from '../../components/inputs/CustomInput';
import {UserBlock} from '../../components/search/UserBlock';
import {useQuery} from '@tanstack/react-query';
import api from '../../api';
import {useDebounce} from 'use-debounce';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [debounceValue] = useDebounce(query, 1000);

  const {data, isPending, status} = useQuery({
    queryKey: ['search-users', debounceValue],
    queryFn: async () => {
      const response = await api.get(`/user/search?query=${debounceValue}`);
      return response.data;
    },
    enabled: !!debounceValue.trim(),
  });

  const users = useMemo(() => {
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  }, [debounceValue, data, status]);

  useEffect(() => {
    if (status == 'success' && data) {
      console.log(data);
    }
  }, [status, data]);
  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View
        style={{
          marginTop: 20,
          paddingBottom: 15,
        }}>
        <View style={{paddingHorizontal: 20}}>
          <CustomInput placeholder="Search users..." onChangeText={setQuery} />
        </View>
      </View>
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({item}) => <UserBlock item={item} />}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
