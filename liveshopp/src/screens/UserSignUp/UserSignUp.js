import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import DefaultIsoCode from '../../constants/DefaultIsoCode';
import auth from '../../services/auth';
import colors from '../../styles/colors';
import validateFrPhoneNumber from '../../utils/validateFrPhoneNumber';

export const UserSignUp = ({ navigation }) => {
  const { t } = useTranslation();
  const UserSignupFormSchema = [
    {
      name: 'lastname',
      label: t('lastname'),
      type: 'text',
      autoFocus: true,
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterLastName'),
        },
      },
    },
    {
      name: 'firstname',
      label: t('firstname'),
      type: 'text',
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterFirstName'),
        },
      },
    },
    {
      name: 'email',
      label: t('email'),
      type: 'text',
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterEmail'),
        },
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: t('pleaseEnterValidEmail'),
        },
      },
    },
    {
      name: 'phone',
      label: t('mobilePhoneNumber'),
      type: 'tel',
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterPhoneNumber'),
        },
        validate: (_, b) => validateFrPhoneNumber(b) || t('pleaseEnterValidNumber'),
      },
      defaultValue: '',
      isoCode: DefaultIsoCode,
    },
    {
      name: 'password',
      label: t('password'),
      type: 'password',
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterPassword'),
        },
        pattern: {
          value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
          message: t('pleaseEnterValidPassword'),
        },
      },
      helper: t('passwordRequirements'),
    },
    {
      name: 'eula',
      label: '',
      type: 'checkbox',
      validation: {
        required: {
          value: true,
          message: t('acceptTerms'),
        },
      },
      helper: {
        helperLink: 'rgpdScreen',
        helperMessage1: t('confirmConditions1'),
        helperMessage2: t('confirmConditions2'),
      },
      defaultValue: false,
    },
  ];

  const { handleSubmit, control } = useForm();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSignup = (data) => {
    setIsLoading(true);

    auth
      .handleUserSignup(data)
      .then((res) => res)
      .then((data) => {
        setMessage(data.message);
        setIsLoading(false);
        navigation.navigate('EmailVerificationCode', {
          message: data.message,
          user_id: data.user.id,
        });
      })
      .catch((err) => {
        setMessage(err.message);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView style={{ marginBottom: 100 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              <View style={styles.headlineContainer}>
                <Text style={styles.headline}>{t('gettingAGoodDealHasNeverBeenEasier')}</Text>
              </View>
              <View style={styles.headlineContainerMessage}>
                <Text style={styles.headlineMessage}>{message}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <FieldWrapper control={control} schema={UserSignupFormSchema} />
              </View>
              <View style={styles.action}>
                <ContainedButton
                  title={t('letsGo')}
                  onPress={handleSubmit(handleUserSignup)}
                  loading={isLoading}
                />
              </View>
              <View style={styles.sellerSignupCta}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                  }}
                  onPress={() => navigation.replace('SellerSignup')}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 17,
                      marginRight: 5,
                    }}>
                    {t('BecomeASeller')}
                  </Text>
                  <FontAwesomeIcon icon={faAnglesRight} color={colors.LIGHT} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sellerSignupCta: {
    marginTop: 20,
  },
  headlineContainer: { marginBottom: 30 },
  formContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  headlineContainerMessage: {
    marginBottom: 30,
    width: 350,
  },
  headlineMessage: { color: colors.LIGHT, textAlign: 'left' },
  fieldContainer: { margin: 10 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    width: 350,
    textAlign: 'left',
  },
  action: {},
  resetPassword: { color: 'white' },
  conditionText: { color: 'white' },
  condition: { width: 350, marginBottom: 30, marginTop: 30 },
});

export default UserSignUp;
