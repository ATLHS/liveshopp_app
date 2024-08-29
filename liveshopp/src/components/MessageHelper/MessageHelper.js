import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import colors from '../../styles/colors';

const MessageHelper = ({ fieldState: { error } }) => {
  const isAuthenticate = useSelector((state) => state.user.isAuthenticate);
  return (
    <Text style={isAuthenticate ? outlinedStyles.error_message : containedStyles.error_message}>
      {error && error.message}
    </Text>
  );
};

const containedStyles = StyleSheet.create({
  error_message: {
    backgroundColor: 'black',
    color: colors.PRIMARY,
    marginBottom: 10,
    marginTop: 10,
    width: 350,
  },
});
const outlinedStyles = StyleSheet.create({
  error_message: {
    color: colors.PRIMARY,
    marginBottom: 10,
    marginTop: 10,
    width: 350,
  },
});

export default MessageHelper;
