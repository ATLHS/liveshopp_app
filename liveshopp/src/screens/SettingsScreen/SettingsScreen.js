import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import email from 'react-native-email';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { REACT_APP_LIVESHOPP_CONTACT, REACT_APP_STRIPE_PUBLIC_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

import i18n from '../../../i18n';
import Headline from '../../components/Auth/Headine/Headline';
import Touchable from '../../components/Auth/Touchable/Touchable';
import ContainedButton from '../../components/ContainedButton/ContainedButton';
import OrderDeliveryStatus from '../../constants/OrderDeliveryStatus';
import { setIsAuthenticate, setUser } from '../../redux/slices/userSlice';
import customer from '../../services/customer';
import stripe from '../../services/stripe';
import colors from '../../styles/colors';

function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const { initialOrder } = useSelector((state) => state.order);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('@token');
    dispatch(setIsAuthenticate(false));
    dispatch(setUser({ profil: null }));
  };

  const goToProfilSetting = () => {
    navigation.navigate('SettingProfilScreen');
  };

  const goSettingShippingAddress = () => {
    navigation.navigate('SettingShippingAddress');
  };

  const goToBlockedUsers = () => {
    navigation.navigate('BlockedUsers');
  };

  const goToAdminBlockedUsers = () => {
    navigation.navigate('AdminBlockedUsers');
  };

  const goToAdminFlaggedUsers = () => {
    navigation.navigate('AdminSignaledUsers');
  };

  const handleEmail = () => {
    const to = [REACT_APP_LIVESHOPP_CONTACT];
    email(to, {
      subject: `${t('messageFrom')}${user.company_name || user.firstname}`,
      checkCanOpen: false,
    }).catch(console.error);
  };

  const goToRGPD = () => {
    navigation.navigate('rgpdScreen');
  };

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    return stripe
      .fetchPaymentSheet()
      .then((res) => res)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const initializePaymentSheet = async () => {
    const payment = await fetchPaymentSheetParams();

    if (payment) {
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Liveshopp',
        customerId: payment.customer,
        customerEphemeralKeySecret: payment.ephemeralKey,
        setupIntentClientSecret: payment.setupIntent,
      });
      if (!error) {
        setLoading(true);
      }
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error(error.message);
    } else {
      customer
        .updateCustomerPaymentMethodStatut()
        .then((res) => res)
        .then((data) => {
          dispatch(setUser(data.user));
          Toast.show({
            type: 'toastSuccess',
            text1: data.message,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const deleteCustomerProfil = async () => {
    customer
      .deleteCustomer(user.id)
      .then((res) => res)
      .then((data) => {
        Toast.show({
          type: 'toastSuccess',
          text1: data.message,
        });
        handleSignOut();
      })
      .catch((err) => {
        setModalVisible(!modalVisible);
        Toast.show({
          type: 'toastError',
          text1: err.message,
        });
      });
  };

  const changeLng = async (lng) => {
    await i18n.changeLanguage(lng);
  };

  useFocusEffect(
    React.useCallback(() => {
      initializePaymentSheet();
    }, []),
  );

  return (
    <StripeProvider publishableKey={REACT_APP_STRIPE_PUBLIC_KEY}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                <Modal animationType="fade" transparent={true} visible={modalVisible}>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.60)',
                    }}>
                    <View
                      style={{
                        height: 200,
                        width: 250,
                        borderRadius: 10,
                        backgroundColor: colors.LIGHT,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            textAlign: 'center',
                            fontFamily: 'FugazOne-Regular',
                          }}>
                          {t('deleteProfileQuestion')}{' '}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            margin: 5,
                            color: colors.PRIMARY,
                            textAlign: 'center',
                          }}>
                          {initialOrder.length &&
                          initialOrder.filter(
                            (order) =>
                              order.userId._id === user.id ||
                              (order.sellerId === user.id &&
                                order.deliveryStatut === OrderDeliveryStatus.PENDING) ||
                              order.deliveryStatut === OrderDeliveryStatus.SHIPPED,
                          ).length
                            ? t('deleteProfileWarning')
                            : t('deleteProfileAttention')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: '100%',
                        }}>
                        <View
                          style={{
                            margin: 10,
                            height: 30,
                          }}>
                          <TouchableOpacity
                            style={{
                              height: 40,
                              width: 70,
                              backgroundColor: 'black',
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={deleteCustomerProfil}>
                            <Text
                              style={{
                                color: colors.LIGHT,
                                textAlign: 'center',
                                fontSize: 20,
                              }}>
                              {t('yes')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            margin: 10,
                            borderRadius: 10,
                            height: 30,
                          }}>
                          <TouchableOpacity
                            style={{
                              height: 40,
                              width: 70,
                              backgroundColor: 'black',
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text
                              style={{
                                color: colors.LIGHT,
                                textAlign: 'center',
                                fontSize: 20,
                              }}>
                              {t('no')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </Modal>
                <Headline title={t('myProfile')} />
                {user.profil === 'admin' && (
                  <>
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 17 }}>Type : Admin</Text>
                      <Text style={{ fontSize: 17 }}>Nom : {user.firstname}</Text>
                      <Text style={{ fontSize: 17 }}>Prénom : {user.lastname}</Text>
                    </View>

                    <Touchable
                      title={t('blockedUsersOnLiveshopp')}
                      onPress={goToAdminBlockedUsers}
                    />
                    <Touchable
                      title={t('reportedUsersOnLiveshopp')}
                      onPress={goToAdminFlaggedUsers}
                    />
                  </>
                )}
                {user.profil !== 'admin' && (
                  <>
                    <Touchable title={t('editProfile')} onPress={goToProfilSetting} />
                    <Touchable title={t('paymentMethod')} onPress={openPaymentSheet} />
                    <Touchable title={t('deliveryAddress')} onPress={goSettingShippingAddress} />
                    <Touchable title={t('blockedUsers')} onPress={goToBlockedUsers} />
                    <Headline title={t('termsAndConditionsAbbreviation')} />
                    <Touchable title={t('termsAndConditions')} onPress={goToRGPD} />
                    <Headline title={t('contact')} />
                    <Touchable title={t('contactUs')} onPress={handleEmail} />
                  </>
                )}
                <ContainedButton title={t('logOut')} onPress={handleSignOut} loading={isLoading} />
                <View style={{ marginTop: 20 }}>
                  <Touchable
                    title={t('confirmDeleteProfile')}
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity onPress={() => changeLng('fr')} style={{ marginRight: 20 }}>
                    <CountryFlag isoCode={'fr'} size={12} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => changeLng('gb')}>
                    <CountryFlag isoCode={'gb'} size={12} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 350,
  },
});

export default SettingsScreen;
