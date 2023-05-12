import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import colors from '../../../styles/colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAnglesRight} from '@fortawesome/free-solid-svg-icons';

const Touchable = ({onPress, title}) => {
  return (
    <TouchableOpacity style={styles.touchableStyle} onPress={onPress}>
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.title}>{title} </Text>
        <FontAwesomeIcon icon={faAnglesRight} size={20} color={colors.DARK} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.DARK,
    textAlign: 'left',
    fontSize: 17,
  },
  touchableStyle: {
    width: 350,
    height: 60,
    marginTop: 10,
    marginBottom: 10,
    borderColor: colors.DARK,
    borderWidth: 2,
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default Touchable;
