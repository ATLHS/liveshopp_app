import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import SelectDropdown from 'react-native-select-dropdown';

import i18n from '../../../i18n';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import OutlinedButton from '../../components/OutlinedButton/OutlinedButton';
import colors from '../../styles/colors';

const Onboarding = ({ navigation }) => {
  const { t } = useTranslation();
  const emojisWithIcons = [
    { title: 'Français', isoCode: 'fr' },
    { title: 'Anglais', isoCode: 'gb' },
  ];
  // to remove
  useEffect(() => {
    console.log(i18n.language, 'langage');
  }, [i18n.language]);
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
        <SelectDropdown
          data={emojisWithIcons}
          onSelect={async (selectedItem, index) => {
            await i18n.changeLanguage(selectedItem.isoCode);
          }}
          defaultValue={'Français'}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                {selectedItem && <CountryFlag isoCode={selectedItem.isoCode} size={10} />}
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Langue'}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: '#D2D9DF' }),
                }}>
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
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
    width: 110,
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 13,
    marginLeft: 10,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 13,
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
    fontSize: 13,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export default Onboarding;
