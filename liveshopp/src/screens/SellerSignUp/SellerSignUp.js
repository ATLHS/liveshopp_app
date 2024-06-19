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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import auth from '../../services/auth';
import colors from '../../styles/colors';

export const SellerSignUp = ({ navigation }) => {
  const { t } = useTranslation();
  const SellerSignupFormSchema = [
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
      name: 'company_name',
      label: t('companyName'),
      type: 'text',
      validation: {
        required: {
          value: true,
          message: t('companyNamePlaceholder'),
        },
      },
    },
    {
      name: 'business_activity',
      label: t('businessSector'),
      type: 'select',
      validation: {
        required: {
          value: true,
          message: t('businessSectorPlaceholder'),
        },
      },
      options: [t('sport'), t('fashion'), t('technology'), t('antique')],
    },
    {
      name: 'role',
      label: t('rolesInCompany'),
      type: 'select',
      validation: {
        required: {
          value: true,
          message: t('rolesInCompanyPlaceholder'),
        },
      },
      options: [t('management'), t('marketing'), t('sales'), t('research')],
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
        pattern: {
          value: /^[0-9]+$/ && /^0[67]\d{8}$/,
          message: t('pleaseEnterValidNumber'),
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
    },
  ];

  const { handleSubmit, control } = useForm();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSellerSignup = (data) => {
    setIsLoading(true);

    auth
      .handleSellerSignup(data)
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
                <Text style={styles.headline}>{t('generateRevenue')}</Text>
              </View>
              <View style={styles.headlineContainerMessage}>
                <Text style={styles.headlineMessage}>{message}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <FieldWrapper control={control} schema={SellerSignupFormSchema} />
              </View>
              {/*<View style={styles.condition}>
                <Text style={styles.conditionText}>
                  En créant votre compte vous acceptez les Conditions Générales
                  d’Utilisation, les Conditions Générales de Vente et la
                  politique de confidentialité de Liveshopp et confirmez avoir
                  plus de 16 ans.
                </Text>
              </View>*/}
              <View style={styles.action}>
                <ContainedButton
                  title={t('letsGo')}
                  onPress={handleSubmit(handleSellerSignup)}
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
    width: 350,
    textAlign: 'center',
  },
  headlineMessage: { color: colors.LIGHT },
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

export default SellerSignUp;
