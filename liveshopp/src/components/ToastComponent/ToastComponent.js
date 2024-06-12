import React from 'react';
import { Text, View } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
        padding: 20,
        borderLeftWidth: 0,
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 5,
        borderColor: 'grey',
        shadowColor: '#171717',
        shadowOffset: { height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <FontAwesomeIcon icon={faTriangleExclamation} color={colors.PRIMARY} size={17} />
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Text style={{ fontSize: 14, color: '#707070', fontWeight: 500 }}>{text1}</Text>
      </View>
    </View>
  ),
  toastSuccess: ({ text1, props }) => (
    <View
      style={{
        padding: 15,
        borderLeftWidth: 0,
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 5,
        borderColor: 'grey',
        shadowColor: '#171717',
        shadowOffset: { height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <FontAwesomeIcon icon={faCircleCheck} color={colors.SUCCESS} size={17} />
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Text style={{ fontSize: 14, color: '#707070', fontWeight: 500 }}>{text1}</Text>
      </View>
    </View>
  ),
  auctionToast: ({ text1 }) => (
    <View
      style={{
        padding: 20,
        borderLeftWidth: 0,
        backgroundColor: 'rgba(9,9,9,0.47)',
        width: '90%',
        borderRadius: 5,
        borderColor: 'grey',
        shadowColor: '#171717',
        shadowOffset: { height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 15,
            color: colors.LIGHT,
            fontWeight: 600,
            textAlign: 'center',
            width: '100%',
          }}>
          {text1}
        </Text>
      </View>
    </View>
  ),
};

const ToastCompoenent = () => {
  return <Toast config={toastConfig} autoHide={true} visibilityTime={5000} />;
};

export default ToastCompoenent;
