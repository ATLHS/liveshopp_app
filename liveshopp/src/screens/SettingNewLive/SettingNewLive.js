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
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import { DateTime } from 'luxon';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import UserType from '../../constants/UserType';
import seller from '../../services/seller';
import colors from '../../styles/colors';
import { checkAndUpdateLiveStatus } from '../../utils/checkAndUpdateLiveStatus';

export const SettingNewLive = ({ navigation }) => {
  const { t } = useTranslation();
  const LiveCreationFormSchema = () => [
    {
      name: 'live_name',
      label: t('liveName'),
      type: 'text',
      validation: {
        required: {
          value: true,
          message: t('liveNamePlaceholder'),
        },
        pattern: {
          value: /^[a-zA-Z\s0-9]*$/i,
          message: t('invalidLiveName'),
        },
      },
      helper: t('allowedCharacters'),
      editable: true,
      defaultValue: '',
    },
    {
      name: 'live_description',
      label: t('uniqueSellingPoint'),
      type: 'textarea',
      editable: true,
      validation: {
        required: {
          value: true,
          message: t('descriptionPlaceholder'),
        },
      },
    },
    {
      name: 'live_date_time',
      label: t('date'),
      type: 'datetime',
      helperMessage: t('minimumHourSpacing'),
      style: { height: 150 },
      minuteInterval: 30,
      minimumDelay: DateTime.now()
        .setZone('Europe/Paris')
        .startOf('minutes') // Début de l'heure actuelle
        .plus({ minutes: 30 - (DateTime.now().minute % 30) })
        .toJSDate(),
    },
  ];
  const { handleSubmit, control } = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLiveCreation = (data) => {
    setIsLoading(true);

    data.live_date_time = data.live_date_time;

    seller
      .createNewLive(data)
      .then((res) => res)
      .then((data) => {
        Toast.show({
          type: 'toastSuccess',
          text1: data.message,
        });
        checkAndUpdateLiveStatus(data.sellerLives, dispatch, UserType.SELLER);
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          contentInset={{ bottom: 100 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              <View style={styles.fieldContainer}>
                <FieldWrapper control={control} schema={LiveCreationFormSchema()} />
              </View>
              <View style={styles.action}>
                <ContainedButton
                  title={t('createTheLive')}
                  onPress={handleSubmit(handleLiveCreation)}
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
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 50,
  },
  headlineContainerMessage: {
    marginBottom: 30,
    width: 350,
    textAlign: 'center',
  },
  headlineMessage: {
    color: colors.DARK,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  fieldContainer: { margin: 10, marginBottom: 30 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    width: 350,
    textAlign: 'left',
  },
  action: {},
  resetPassword: { color: 'white' },
});

export default SettingNewLive;
