import React from 'react';
import { StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useSelector } from 'react-redux';

import colors from '../../styles/colors';

const SelectType = ({ inputField, field, fieldState }) => {
  const isAuthenticate = useSelector((state) => state.user.isAuthenticate);
  return (
    <SelectDropdown
      data={inputField.options}
      onSelect={(selectedItem) => {
        field.onChange(selectedItem);
      }}
      defaultButtonText={inputField.label}
      buttonStyle={isAuthenticate ? outlinedStyles.buttonStyle : containedStyles.buttonStyle}
      buttonTextStyle={
        isAuthenticate ? outlinedStyles.buttonTextStyle : containedStyles.buttonTextStyle
      }
      rowStyle={isAuthenticate ? outlinedStyles.rowStyle : containedStyles.rowStyle}
      selectedRowStyle={
        isAuthenticate ? outlinedStyles.selectedRowStyle : containedStyles.selectedRowStyle
      }
      rowTextStyle={isAuthenticate ? outlinedStyles.rowTextStyle : containedStyles.rowTextStyle}
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
  buttonStyle: {
    position: 'relative',
    color: colors.LIGHT,
    backgroundColor: colors.DARK,
    borderColor: colors.LIGHT,
    borderWidth: 1,
    width: 350,
    height: 55,
    borderRadius: 6,
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
});

const outlinedStyles = StyleSheet.create({
  buttonStyle: {
    position: 'relative',
    color: colors.DARK,
    borderColor: colors.DARK,
    width: 350,
    height: 55,
    fontSize: 13,
    fontWeight: '600',
    borderRadius: 6,
    justifyContent: 'flex-end',
    backgroundColor: '#F8F7F7',
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
});

export default SelectType;
