import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';

import i18n from '../../../i18n';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import OutlinedButton from '../../components/OutlinedButton/OutlinedButton';
import colors from '../../styles/colors';

const Onboarding = ({ navigation }) => {
  useEffect(() => {}, [i18n]);
  const { t } = useTranslation();

  const changeLng = async (lng) => {
    await i18n.changeLanguage(lng);
  };

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
            <Text style={styles.headline}>{t('slogan')}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <ContainedButton
            title={t('signup')}
            onPress={() => navigation.navigate('UserSignup')}
            loading={undefined}
          />
          {}
          <OutlinedButton title={t('login')} onPress={() => navigation.navigate('SignIn')} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => changeLng('fr')} style={{ marginRight: 10 }}>
            <CountryFlag isoCode={'fr'} size={10} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLng('gb')}>
            <CountryFlag isoCode={'us'} size={10} />
          </TouchableOpacity>
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

  dropdownButtonStyle: {
    width: 130,
    height: 35,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 11,
    marginLeft: 10,
    fontWeight: '500',
    textAlign: 'center',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 13,
    color: 'red',
  },
  dropdownButtonIconStyle: {
    fontSize: 13,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#151E26',
    marginLeft: 10,
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export default Onboarding;
