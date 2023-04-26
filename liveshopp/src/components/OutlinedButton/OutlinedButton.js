import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../styles/colors';

const OutlinedButton = ({
  onPress,
  title,
  touchableBackgroundColor,
  textColor,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.touchableStyle,
        {borderColor: touchableBackgroundColor || colors.LIGHT},
      ]}
      onPress={onPress}>
      <Text style={[styles.title, {color: textColor || colors.LIGHT}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.LIGHT,
    textAlign: 'center',
    fontSize: 20,
  },
  touchableStyle: {
    width: 350,
    height: 60,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderColor: colors.LIGHT,
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
  },
});

export default OutlinedButton;
