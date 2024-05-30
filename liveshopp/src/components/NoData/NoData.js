import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../../styles/colors';

const NoData = ({ message, title, buttonTitle, onPress }) => {
  return (
    <View
      style={{
        width: 290,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontFamily: 'Roboto-Regular',
          color: colors.DARK,
          fontWeight: '800',
          textAlign: 'center',
        }}>
        {title}
      </Text>
      {message ? (
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            color: colors.DARK,
            padding: 10,
            textAlign: 'center',
          }}>
          {message}
        </Text>
      ) : (
        <></>
      )}
      {buttonTitle ? (
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: 250,
            height: 40,
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: colors.DARK,
            borderRadius: 5,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              color: colors.LIGHT,
              textAlign: 'center',
              fontSize: 13,
            }}>
            {buttonTitle}
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default NoData;
