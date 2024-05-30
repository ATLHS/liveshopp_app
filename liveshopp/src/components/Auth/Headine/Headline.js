import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import colors from '../../../styles/colors';

const width = Dimensions.get('window').width;
export const AuthHeadline = ({ title }) => {
  return (
    <View style={styles.profilHeadline}>
      <Text style={styles.headline}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profilHeadline: {
    width,
  },
  headline: {
    color: colors.DARK,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default AuthHeadline;
