import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { useSelector } from 'react-redux';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import countries from '../../../assets/countryCode';
import colors from '../../styles/colors';

const PhoneField = ({ inputField, field, fieldState }) => {
  const isAuthenticate = useSelector((state) => state.user.isAuthenticate);
  const { t } = useTranslation();

  const [showModalCountryPhoneSelector, setShowModalCountryPhoneSelector] = useState(false);
  const [isoCode, setIsoCode] = useState('fr');
  const [countryCode, setCountryCode] = useState({
    name: 'France',
    flag: '🇫🇷',
    code: 'FR',
    dial_code: '+33',
  });

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModalCountryPhoneSelector}
        presentationStyle={'formSheet'}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowModalCountryPhoneSelector(!showModalCountryPhoneSelector)}>
            <FontAwesomeIcon icon={faXmark} size={20} color={colors.DARK} style={styles.xMark} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('countryRegion')}</Text>
        </View>
        <View style={styles.container}>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setShowModalCountryPhoneSelector(!showModalCountryPhoneSelector);
                  setCountryCode(item);
                  setIsoCode(item.code.toLowerCase());
                }}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>({item.dial_code})</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      <View style={isAuthenticate ? outlinedStyles.phoneField : containedStyles.phoneField}>
        <View
          style={
            isAuthenticate
              ? outlinedStyles.containerPhoneField
              : containedStyles.containerPhoneField
          }>
          <CountryFlag isoCode={isoCode} size={13} />

          <Text style={isAuthenticate ? outlinedStyles.dialCode : containedStyles.dialCode}>
            ({countryCode.dial_code})
          </Text>
          <TouchableOpacity
            style={styles.selectContainerIcon}
            onPress={() => setShowModalCountryPhoneSelector(!showModalCountryPhoneSelector)}>
            <FontAwesomeIcon
              icon={faChevronDown}
              size={13}
              color={isAuthenticate ? colors.DARK : colors.LIGHT}
              style={styles.chevronRight}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={isAuthenticate ? outlinedStyles.textInput : containedStyles.textInput}
          defaultValue={inputField.defaultValue}
          value={inputField.value}
          placeholder={inputField.label}
          autoFocus={inputField.autoFocus || false}
          onChangeText={(value) => field.onChange(`${countryCode.dial_code} ${value}`)}
          placeholderTextColor="white"
          secureTextEntry={inputField.type === 'password'}
          selectionColor={isAuthenticate ? colors.DARK : colors.LIGHT}
          maxLength={countryCode.code === 'FR' ? 10 : 20}
          keyboardType="number-pad"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectContainerIcon: {
    height: '100%',
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 15,
    marginRight: 5,
    color: colors.DARK,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  chevronRight: {
    marginLeft: 5,
  },
  xMark: { marginRight: 'auto' },
});

const containedStyles = StyleSheet.create({
  phoneField: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    width: 350,
    height: 60,
    borderRadius: 6,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: 60,
    alignItems: 'center',
    width: 350,
    padding: 10,
    color: 'white',
  },
  containerPhoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.LIGHT,
    height: '100%',
    padding: 10,
  },
  dialCode: { color: colors.LIGHT, marginLeft: 10 },
});

const outlinedStyles = StyleSheet.create({
  phoneField: {
    backgroundColor: '#F8F7F7',
    height: 55,
    width: 350,
    borderRadius: 6,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: 60,
    alignItems: 'center',
    width: 350,
    padding: 10,
    color: colors.DARK,
  },
  containerPhoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    padding: 10,
  },
  dialCode: { color: colors.DARK, marginLeft: 10 },
});

export default PhoneField;
