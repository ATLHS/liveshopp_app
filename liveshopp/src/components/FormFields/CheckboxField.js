import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import colors from '../../styles/colors';

const CheckboxField = ({ inputField, field, fieldState }) => {
  return (
    <View style={styles.checkboxContainer}>
      <CheckBox
        disabled={false}
        lineWidth={1}
        onValueChange={(value) => field.onChange(value)}
        onCheckColor={colors.LIGHT}
        onTintColor={colors.LIGHT}
        tintColor={colors.LIGHT}
        boxType={'square'}
        tintColors={{ true: colors.LIGHT, false: colors.LIGHT }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    marginTop: 25,
    marginBottom: 10,
  },
});

export default CheckboxField;
