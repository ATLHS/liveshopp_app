import React from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { useSelector } from 'react-redux';

import colors from '../../styles/colors';

const PhoneField = ({ inputField, field, fieldState }) => {
  const isAuthenticate = useSelector((state) => state.user.isAuthenticate);
  return (
    <View style={isAuthenticate ? outlinedStyles.phoneField : containedStyles.phoneField}>
      <CountryFlag isoCode="fr" size={15} />
      <TextInput
        style={isAuthenticate ? outlinedStyles.textInput : containedStyles.textInput}
        defaultValue={inputField.defaultValue}
        value={inputField.value}
        placeholder={inputField.label}
        autoFocus={inputField.autoFocus || false}
        onChangeText={(value) => field.onChange(value)}
        placeholderTextColor="white"
        secureTextEntry={inputField.type === 'password'}
        selectionColor={isAuthenticate ? colors.DARK : colors.LIGHT}
        maxLength={10}
        keyboardType="number-pad"
      />
    </View>
  );
};

const containedStyles = StyleSheet.create({
  phoneField: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    width: 350,
    height: 60,
    borderRadius: 6,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    height: 60,
    alignItems: 'center',
    width: 350,
    padding: 10,
    color: 'white',
  },
});

const outlinedStyles = StyleSheet.create({
  phoneField: {
    backgroundColor: '#F8F7F7',
    height: 55,
    width: 350,
    borderRadius: 6,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    height: 60,
    alignItems: 'center',
    width: 350,
    padding: 10,
    color: colors.DARK,
  },
});

export default PhoneField;
