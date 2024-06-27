import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CheckBox from 'react-native-check-box';

const CheckboxField = ({ inputField, field, fieldState }) => {
  const [isChecked, setIsChecked] = useState(inputField.defaultValue);
  return (
    <View style={styles.checkboxContainer}>
      <CheckBox
        checkBoxColor={'white'}
        isChecked={isChecked}
        onClick={() => {
          setIsChecked(!isChecked);
          field.onChange(!isChecked);
        }}
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
