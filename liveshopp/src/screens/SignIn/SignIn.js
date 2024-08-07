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
import { useDispatch } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import { setIsAuthenticate, setUser } from '../../redux/slices/userSlice';
import auth from '../../services/auth';
import axiosConfig from '../../services/config/axiosConfig';
import { updateUserDevice } from '../../services/notifications';
import colors from '../../styles/colors';

export const SignIn = ({ navigation, route }) => {
  const { t } = useTranslation();
  const signInFormSchema = [
    {
      name: 'email',
      label: t('email'),
      type: 'text',
      autoFocus: true,
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
      name: 'password',
      label: t('password'),
      type: 'password',
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterYourPassword'),
        },
      },
    },
  ];
  const { handleSubmit, control } = useForm();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params && route.params.message) {
      setMessage(route.params.message);
    }
  }, [route]);

  const handleSignin = (data) => {
    setIsLoading(false);
    auth
      .handleUserSignIn(data)
      .then((data) => {
        setIsLoading(false);
        if (data.user.isBanned) {
          return setMessage(t('accountBlocked'));
        }
        AsyncStorage.setItem('@token', data.token).then((r) => {
          axiosConfig.defaults.headers.Authorization = `Bearer ${data.token}`;
          dispatch(setUser(data.user));
          dispatch(setIsAuthenticate(true));
        });

        updateUserDevice();
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
        setIsLoading(false);
      });
  };

  const goToResetPassword = () => {
    navigation.navigate('ResetPassword');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentInset={{ bottom: 100 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              <View style={styles.headlineContainer}>
                <Text style={styles.headline}>Welcome back !</Text>
              </View>
              <View style={styles.headlineContainerMessage}>
                <Text style={styles.headlineMessage}>{message}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <FieldWrapper control={control} schema={signInFormSchema} />
              </View>

              <View style={styles.helper}>
                <TouchableWithoutFeedback onPress={() => goToResetPassword()}>
                  <Text style={styles.helperText}>{t('forgotPassword')}</Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.action}>
                <ContainedButton
                  title={t('login')}
                  onPress={handleSubmit(handleSignin)}
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
  headlineContainerMessage: {
    marginBottom: 30,
    width: 280,
    textAlign: 'center',
  },
  headlineMessage: { color: colors.LIGHT },
  fieldContainer: { margin: 10, marginBottom: 0 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
  },
  action: { marginTop: 10 },
  resetPassword: { color: 'white' },
  helperText: {
    color: 'white',
    textAlign: 'left',
    width: 350,
    textDecorationLine: 'underline',
  },
  helper: { width: 350 },
});

export default SignIn;
