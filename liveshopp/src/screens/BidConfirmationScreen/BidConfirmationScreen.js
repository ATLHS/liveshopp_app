import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import colors from '../../styles/colors';

export const BidConfirmationScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedOffer, setSelectedOffer] = useState({});

  useEffect(() => {
    const { selectedOfferParams } = route.params;
    setSelectedOffer(selectedOfferParams);
    Vibration.vibrate(1 * 1000);
  }, [selectedOffer, route.params]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.welcomeContainer}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 40,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                }}>
                {t('congratulations')}
              </Text>
              <View style={{ marginTop: 20 }}>
                <Image
                  style={{
                    height: 110,
                    width: 110,
                    transform: [{ rotate: '10deg' }],
                  }}
                  source={require('../../../assets/images/auction_hammer.png')}
                />
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 60,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  width: 320,
                  color: 'grey',
                  marginBottom: 15,
                }}>
                {t('youAreNowInTheRunningFor')}
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  textAlign: 'center',
                  fontWeight: 700,
                  width: 320,
                  color: 'black',
                  marginBottom: 15,
                }}>
                {selectedOffer.productName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  width: 320,
                  color: 'grey',
                  marginBottom: 15,
                }}>
                {' '}
                {t('atTheEndOfTheAuction')}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  width: 320,
                  color: 'grey',
                  marginBottom: 15,
                }}>
                {t('goodLuck')}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headlineContainer: { marginBottom: 30, color: 'black' },
  welcomeContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  fieldContainer: { margin: 10 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'FugazOne-Regular',
    fontSize: 30,
    width: 280,
    textAlign: 'center',
  },
});

export default BidConfirmationScreen;
