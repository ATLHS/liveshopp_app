import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import { setUser } from '../../redux/slices/userSlice';
import { store } from '../../redux/store';
import customer from '../../services/customer';
import colors from '../../styles/colors';

export const SettingShippingAddress = ({ navigation }) => {
  const { t } = useTranslation();
  const ShippingAddressFormSchema = () => [
    {
      name: 'shipping_address',
      label: t('deliveryAddress'),
      type: 'places',
      validation: {
        required: {
          value: true,
          message: t('provideDeliveryAddress'),
        },
      },
      editable: true,
    },
  ];

  const { handleSubmit, control } = useForm({
    defaultValues: {
      shipping_address: store.getState().user.user.shipping_address,
    },
  });

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleShippingAddress = (data) => {
    setIsLoading(false);
    customer
      .updateCustomerShippingAdrress(data)
      .then((res) => res)
      .then((data) => {
        Toast.show({
          type: 'toastSuccess',
          text1: data.message,
        });
        dispatch(setUser(data.user));
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((err) => {
        Toast.show({
          type: 'toastError',
          text1: err.message,
        });
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <View style={styles.places}>
              <FieldWrapper control={control} schema={ShippingAddressFormSchema()} />
            </View>
            <View style={styles.action}>
              <ContainedButton
                title={t('submit')}
                onPress={handleSubmit(handleShippingAddress)}
                loading={isLoading}
              />
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
  headlineContainer: { marginBottom: 30 },
  formContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  places: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
  },
  headlineContainerMessage: {
    marginBottom: 30,
    width: 350,
    textAlign: 'center',
  },
  headlineMessage: { color: colors.DARK },
  fieldContainer: { margin: 10, marginBottom: 30, height: 200 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    width: 350,
    textAlign: 'left',
  },
  action: {
    position: 'absolute',
    top: 90,
  },
  resetPassword: { color: 'white' },
});

export default SettingShippingAddress;
