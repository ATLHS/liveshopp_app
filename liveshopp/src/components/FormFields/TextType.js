import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const TextType = ({ inputField, field }) => {
  const isAuthenticate = useSelector((state) => state.user.isAuthenticate);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View>
      {inputField.type === 'password' && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            zIndex: 2,
            height: 60,
            width: 35,
            justifyContent: 'center',
            alignItems: 'center',
            left: 313,
          }}
          onPress={() => setShowPassword(!showPassword)}>
          {!showPassword ? (
            <FontAwesomeIcon style={{}} icon={faEyeSlash} color={colors.LIGHT} size={15} />
          ) : (
            <FontAwesomeIcon style={{}} icon={faEye} color={colors.LIGHT} size={15} />
          )}
        </TouchableOpacity>
      )}
      <TextInput
        style={
          isAuthenticate
            ? [
                outlinedStyles.textInput,
                !inputField.editable
                  ? { backgroundColor: '#F8F7F7' }
                  : { backgroundColor: '#F8F7F7' },
              ]
            : containedStyles.textInput
        }
        placeholder={inputField.label}
        autoFocus={inputField.autoFocus || false}
        autoCapitalize={
          inputField.type === 'password' || inputField.name === 'email' ? 'none' : 'sentences'
        }
        onChangeText={(value) => field.onChange(value)}
        defaultValue={inputField.defaultValue}
        placeholderTextColor={isAuthenticate ? '#707070' : colors.LIGHT}
        secureTextEntry={inputField.type === 'password' && !showPassword}
        selectionColor={isAuthenticate ? colors.DARK : colors.LIGHT}
        editable={inputField.editable}
        keyboardType={inputField.keyboardType ? inputField.keyboardType : 'default'}
      />
    </View>
  );
};

const containedStyles = StyleSheet.create({
  textInput: {
    color: 'white',
    backgroundColor: colors.DARK,
    borderColor: 'white',
    borderWidth: 1,
    width: 350,
    height: 55,
    borderRadius: 6,
    padding: 10,
  },
});

const outlinedStyles = StyleSheet.create({
  textInput: {
    color: colors.DARK,
    fontSize: 13,
    fontWeight: '600',
    width: 350,
    height: 55,
    borderRadius: 6,
    padding: 10,
  },
});

export default TextType;
