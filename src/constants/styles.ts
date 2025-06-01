import {StyleSheet} from 'react-native';

const commonStyles = StyleSheet.create({
  'items-center': {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'flex-center': {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  'flex-between': {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export {commonStyles};
