import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import OutlinedButton from '../../components/OutlinedButton/OutlinedButton';
import colors from '../../styles/colors';

const Onboarding = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', alignItems: 'center' }}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <View style={styles.brandIconContainer}>
            <Image
              style={styles.brandIcon}
              source={require('../../../assets/images/liveshopp_icon.png')}
            />
          </View>
          <View style={styles.brandContainer}>
            <Text style={styles.brandName}>LIVESHOPP</Text>
          </View>
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>Vendez et achetez en live.</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <ContainedButton
            title="Inscription"
            onPress={() => navigation.navigate('UserSignup')}
            loading={undefined}
          />
          {}
          <OutlinedButton title="Connexion" onPress={() => navigation.navigate('SignIn')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 350,
    backgroundColor: 'black',
  },
  brand: {
    flex: 4,
    justifyContent: 'flex-end',
  },
  brandIcon: {
    width: 140,
    height: 140,
  },
  brandIconContainer: {
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandName: {
    textAlign: 'center',
    fontFamily: 'FugazOne-Regular',
    fontSize: 40,
    color: colors.LIGHT,
  },
  headlineContainer: {
    marginBottom: 60,
  },
  headline: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    textAlign: 'center',
    color: colors.LIGHT,
    marginTop: 15,
  },
  actions: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Onboarding;
