import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import colors from '../../styles/colors';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';

const SelectType = ({inputField, field, fieldState}) => {
  const {error} = fieldState;
  const isAuthenticate = useSelector(state => state.user.isAuthenticate);
  return (
    <SelectDropdown
      data={inputField.options}
      onSelect={selectedItem => {
        field.onChange(selectedItem);
      }}
      defaultButtonText={inputField.label}
      buttonStyle={
        isAuthenticate
          ? outlinedStyles.buttonStyle
          : containedStyles.buttonStyle
      }
      buttonTextStyle={
        isAuthenticate
          ? outlinedStyles.buttonTextStyle
          : containedStyles.buttonTextStyle
      }
      rowStyle={
        isAuthenticate ? outlinedStyles.rowStyle : containedStyles.rowStyle
      }
      selectedRowStyle={
        isAuthenticate
          ? outlinedStyles.selectedRowStyle
          : containedStyles.selectedRowStyle
      }
      rowTextStyle={
        isAuthenticate
          ? outlinedStyles.rowTextStyle
          : containedStyles.rowTextStyle
      }
      dropdownStyle={
        isAuthenticate
          ? {
              backgroundColor: colors.LIGHT,
              borderRadius: 6,
              marginTop: 5,
            }
          : {
              backgroundColor: '#222222',
              borderRadius: 6,
              marginTop: 5,
            }
      }
      disabled={inputField.editable}
    />
  );
};

const containedStyles = StyleSheet.create({
  textInput: {
    color: colors.LIGHT,
    backgroundColor: colors.DARK,
    borderColor: colors.LIGHT,
    borderWidth: 1,
    width: 350,
    height: 55,
    borderRadius: 6,
    marginBottom: 10,
    padding: 10,
  },
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.LIGHT,
  },
  inputContainerStyle: {height: 50, width: 350},
  inputStyle: {
    color: colors.LIGHT,
  },
  errorStyle: {margin: 0, marginTop: 5, color: colors.ALERT, width: 350},
  buttonStyle: {
    position: 'relative',
    color: colors.LIGHT,
    backgroundColor: colors.DARK,
    borderColor: colors.LIGHT,
    borderWidth: 1,
    width: 350,
    height: 55,
    borderRadius: 6,
    marginBottom: 15,
    justifyContent: 'flex-end',
  },
  buttonTextStyle: {
    position: 'absolute',
    color: colors.LIGHT,
    paddingLeft: 10,
    fontSize: 14,
  },
  rowStyle: {
    borderBottomColor: '#222222',
  },
  selectedRowStyle: {
    backgroundColor: '#3E3E3E',
    borderRadius: 6,
  },
  rowTextStyle: {
    color: colors.LIGHT,
    textAlign: 'left',
  },
  dropDownStyle: {
    backgroundColor: '#222222',
    borderRadius: 6,
    marginTop: 5,
  },
});

const outlinedStyles = StyleSheet.create({
  textInput: {
    color: colors.DARK,
    backgroundColor: colors.LIGHT,
    borderColor: colors.DARK,
    borderWidth: 1,
    width: 350,
    height: 55,
    borderRadius: 6,
    marginBottom: 10,
    padding: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.DARK,
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainerStyle: {height: 50, width: 350},
  inputStyle: {
    color: colors.DARK,
    fontSize: 13,
    fontWeight: '600',
  },
  errorStyle: {margin: 0, marginTop: 5, color: colors.ALERT, width: 350},
  buttonStyle: {
    position: 'relative',
    color: colors.DARK,
    borderColor: colors.DARK,
    width: 350,
    height: 55,
    fontSize: 13,
    fontWeight: '600',
    borderRadius: 6,
    marginBottom: 15,
    justifyContent: 'flex-end',
    backgroundColor: '#F8F7F7'
  },
  buttonTextStyle: {
    position: 'absolute',
    color: colors.DARK,
    paddingLeft: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  rowStyle: {
    borderBottomColor: '#222222',
  },
  selectedRowStyle: {
    backgroundColor: '#3E3E3E',
    borderRadius: 6,
  },
  rowTextStyle: {
    color: colors.DARK,
    textAlign: 'left',
  },
  dropDownStyle: {
    backgroundColor: '#222222',
    borderRadius: 6,
    marginTop: 5,
  },
});

export default SelectType;
