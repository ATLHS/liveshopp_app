import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';

const TextType = ({inputField, field}) => {
  const isAuthenticate = useSelector(state => state.user.isAuthenticate);
  return (
    <TextInput
      style={
        isAuthenticate
          ? [
              outlinedStyles.textInput,
              !inputField.editable
                ? {backgroundColor: colors.DISABLED}
                : {backgroundColor: colors.LIGHT},
            ]
          : containedStyles.textInput
      }
      placeholder={inputField.label}
      autoFocus={inputField.autoFocus || false}
      onChangeText={value => field.onChange(value)}
      defaultValue={inputField.defaultValue}
      placeholderTextColor={isAuthenticate ? colors.DARK : colors.LIGHT}
      secureTextEntry={inputField.type === 'password'}
      selectionColor={isAuthenticate ? colors.DARK : colors.LIGHT}
      editable={inputField.editable}
    />
  );
};

const containedStyles = StyleSheet.create({
  textInput: {
    color: 'white',
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    width: 350,
    height: 60,
    borderRadius: 6,
    marginBottom: 15,
    padding: 10,
  },
});

const outlinedStyles = StyleSheet.create({
  textInput: {
    color: colors.DARK,
    borderColor: colors.DARK,
    borderWidth: 1,
    width: 350,
    height: 60,
    borderRadius: 6,
    marginBottom: 15,
    padding: 10,
  },
});

export default TextType;
