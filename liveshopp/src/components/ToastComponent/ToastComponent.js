import React from 'react';
import { Text, View } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import colors from '../../styles/colors';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        padding: 10,
        borderLeftWidth: 0,
        backgroundColor: '#D2FFB9',
        width: 350,
      }}
      contentContainerStyle={{ paddingHorizontal: 0 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text1NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        padding: 10,
        borderLeftWidth: 0,
        backgroundColor: '#FFB1B1',
        width: 350,
      }}
      contentContainerStyle={{ paddingHorizontal: 0 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text1NumberOfLines={2}
    />
  ),
  toastError: ({ text1, props }) => (
    <View
      style={{
        padding: 10,
        borderLeftWidth: 0,
        backgroundColor: '#FFB1B1',
        width: 350,
        borderRadius: 5,
      }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '400',
          width: 350,
        }}>
        {text1}
      </Text>
    </View>
  ),
  auctionToast: ({ text1 }) => (
    <View
      style={{
        padding: 10,
        borderColor: 'transparent',
        borderWidth: 1,
        borderLeftColor: 'transparent',
        borderLeftWidth: 1,
        backgroundColor: 'black',
        width: 350,
        height: 80,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 20,
          width: 350,
          color: colors.LIGHT,
          textAlign: 'center',
          fontFamily: 'FugazOne-Regular',
        }}>
        {text1} !
      </Text>
    </View>
  ),
};

const ToastCompoenent = () => {
  return <Toast config={toastConfig} autoHide={true} />;
};

export default ToastCompoenent;
