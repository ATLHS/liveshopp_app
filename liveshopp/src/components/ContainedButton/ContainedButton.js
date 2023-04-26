import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import colors from '../../styles/colors';

const ContainedButton = ({onPress, title, loading}) => {
  return (
    <TouchableOpacity
      disabled={loading}
      style={styles.touchableStyle}
      onPress={onPress}>
      {!loading ? (
        <Text style={styles.title}>{title} </Text>
      ) : (
        <ActivityIndicator size="small" color={colors.DARK} />
      )}
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
    backgroundColor: colors.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default ContainedButton;
