import React, { useEffect, useState } from 'react';
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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import auth from '../../services/auth';
import colors from '../../styles/colors';

export const EmailVerificationCode = ({ navigation, route }) => {
  const { t } = useTranslation();
  const EmailVerificationCodeSchema = [
    {
      name: 'code',
      label: '',
      type: 'code',
      autoFocus: true,
      validation: {
        required: t('emailVerificationCode'),
        minLength: {
          value: 4,
          message: t('emailVerificationCode'),
        },
      },
    },
  ];
  const { handleSubmit, control } = useForm();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user_id, resetPassword } = route.params;

  useEffect(() => {
    setMessage(route.params.message);
  }, []);

  const handleEmailVerificationCode = (data) => {
    setIsLoading(true);
    data.id = user_id;
    auth
      .handleEmailVerificationCode(data)
      .then((res) => res)
      .then((data) => {
        setIsLoading(false);
        AsyncStorage.setItem('@token', data.token);
        navigation.navigate('Welcome', {
          data,
        });
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setIsLoading(false);
      });
  };

  const handleResetPassword = (data) => {
    setIsLoading(true);
    data.id = user_id;
    auth
      .checkResetPasswordCode(data)
      .then((res) => res)
      .then((data) => {
        setIsLoading(false);
        navigation.navigate('ResetCustomerPassword', {
          user_id: data.user.id,
        });
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              <View style={styles.headlineContainer}>
                <Text style={styles.headline}>
                  {t('enterCode', {
                    codeType: t(`${resetPassword ? 'verification' : 'confirmation'}`),
                  })}
                </Text>
              </View>
              <View style={styles.helper}>
                <Text style={styles.helperText}>{message}</Text>
              </View>
              <View style={styles.errorHelper}>
                <Text style={styles.errorHelperText}>{errorMessage}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <FieldWrapper control={control} schema={EmailVerificationCodeSchema} />
              </View>
              <View style={styles.action}>
                <ContainedButton
                  title={t('completeRegistration')}
                  onPress={handleSubmit(
                    resetPassword ? handleResetPassword : handleEmailVerificationCode,
                  )}
                  loading={isLoading}
                />
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
  headlineContainer: { marginBottom: 30 },
  formContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  fieldContainer: { margin: 10 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    textAlign: 'left',
    width: 350,
  },
  action: {},
  resetPassword: { color: 'white' },
  helperText: { color: 'white', textAlign: 'left', width: 350 },
  helper: { wwidth: 350, marginBottom: 30 },
  errorHelper: { width: 350, marginBottom: 10, textAlign: 'left' },
  errorHelperText: { color: colors.PRIMARY },
});

export default EmailVerificationCode;
