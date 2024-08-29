import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import colors from '../../styles/colors';

const TextArea = ({ inputField, field }) => {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={inputField.label}
      autoFocus={inputField.autoFocus || false}
      onChangeText={(value) => field.onChange(value)}
      placeholderTextColor="#707070"
      defaultValue={inputField.defaultValue}
      secureTextEntry={inputField.type === 'password'}
      selectionColor={colors.DARK}
      multiline={true}
      numberOfLines={4}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: 'black',
    backgroundColor: '#F8F7F7',
    fontSize: 13,
    fontWeight: '600',
    width: 350,
    height: 150,
    borderRadius: 6,
    padding: 10,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
});

export default TextArea;
