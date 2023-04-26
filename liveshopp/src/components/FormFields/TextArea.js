import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import colors from '../../styles/colors';

const TextArea = ({inputField, field, fieldState}) => {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={inputField.label}
      autoFocus={inputField.autoFocus || false}
      onChangeText={value => field.onChange(value)}
      placeholderTextColor="black"
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
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    width: 350,
    height: 150,
    borderRadius: 6,
    marginBottom: 10,
    padding: 10,
    paddingTop: 10,
  },
});

export default TextArea;
