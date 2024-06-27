import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import ContainedButton from '../../components/ContainedButton/ContainedButton';
import FieldWrapper from '../../components/FieldWrapper/FieldWrapper';
import { setUser } from '../../redux/slices/userSlice';
import customer from '../../services/customer';
import colors from '../../styles/colors';
import validateFrPhoneNumber from '../../utils/validateFrPhoneNumber';

export const SettingProfilScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [imageUri, setImageUri] = useState(user.imageUrl || null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [user, imageUri]);

  const SettingProfilScreenFormUser = [
    {
      name: 'lastname',
      label: t('lastname'),
      type: 'text',
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterLastName'),
        },
      },
      editable: true,
      defaultValue: user.lastname,
      row: true,
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
      editable: true,
      defaultValue: user.firstname,
      row: true,
    },
    {
      name: 'phone',
      label: user.phone ? t('mobilePhoneNumber') : '',
      type: 'tel',
      validation: {
        required: {
          value: user.phone ? true : false,
          message: t('pleaseEnterPhoneNumber'),
        },
        validate: (_, b) => validateFrPhoneNumber(b) || t('pleaseEnterValidNumber'),
      },
      editable: true,
      defaultValue: user.phone || '',
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
      editable: false,
      defaultValue: user.email,
    },
  ];

  const SettingProfilScreenFormSeller = [
    {
      name: 'lastname',
      label: t('lastname'),
      type: 'text',
      validation: {
        required: {
          value: true,
          message: t('pleaseEnterLastName'),
        },
      },
      editable: true,
      defaultValue: user.lastname,
      row: true,
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
      editable: true,
      defaultValue: user.firstname,
      row: true,
    },
    {
      name: 'company_name',
      label: user.company_name,
      type: 'text',
      editable: false,
      defaultValue: user.company_name,
    },
    {
      name: 'websiteUrl',
      label: t('website'),
      type: 'text',
      editable: true,
      defaultValue: user.websiteUrl || '',
    },
    {
      name: 'instagram',
      label: 'Instagram',
      type: 'text',
      editable: true,
      defaultValue: user.instagram || '',
    },
    {
      name: 'tiktok',
      label: 'Tiktok',
      type: 'text',
      editable: true,
      defaultValue: user.tiktok || '',
    },
    {
      name: 'bio',
      label: t('bio'),
      type: 'textarea',
      editable: true,
      defaultValue: user.bio || '',
    },
    {
      name: 'business_activity',
      label: user.business_activity,
      type: 'select',
      editable: true,
      defaultValue: user.business_activity,
    },
    {
      name: 'role',
      label: user.role,
      type: 'select',
      options: [t('management'), t('marketing'), t('sales'), t('research')],
      editable: true,
      defaultValue: user.role,
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
      editable: true,
      defaultValue: user.phone,
    },
    {
      name: 'email',
      label: t('email'),
      type: 'text',
      editable: false,
      defaultValue: user.email,
    },
  ];

  const schemaForm =
    user.profil === 'seller' ? SettingProfilScreenFormSeller : SettingProfilScreenFormUser;

  const { handleSubmit, control } = useForm({
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      company_name: user.company_name || null,
      business_activity: user.business_activity || null,
      role: user.role || null,
      phone: user.phone || null,
      email: user.email,
      bio: user.bio || null,
      tiktok: user.tiktok || null,
      instagram: user.instagram || null,
      websiteUrl: user.websiteUrl || null,
    },
  });

  const setProfilPicture = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.didCancel) {
      return;
    }

    setIsLoading(true);
    setImageUri(null);
    customer
      .setProfilPicture(result.assets[0])
      .then((res) => res)
      .then((data) => {
        setImageUri(data.user.imageUrl);
        // setRefreshCounter(prevCounter => prevCounter + 1);
        Toast.show({
          type: 'toastSuccess',
          text1: data.message,
        });
        dispatch(setUser(data.user));

        setIsLoading(false);
      })
      .catch((err) => {
        Toast.show({
          type: 'toastError',
          text1: err.message,
        });
        setIsLoading(false);
      });
  };

  const deleteProfilPicture = async () => {
    setIsLoading(true);
    customer
      .deleteProfilPicture()
      .then((res) => res)
      .then((data) => {
        setImageUri(null);
        Toast.show({
          type: 'toastSuccess',
          text1: data.message,
        });
        dispatch(setUser(data.user));

        setIsLoading(false);
      })
      .catch((err) => {
        Toast.show({
          type: 'toastError',
          text1: err.message,
        });
        setIsLoading(false);
      });
  };

  const handleProfilSetting = (data) => {
    setIsLoading(true);
    customer
      .updateCustomerProfil(data)
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          contentInset={{ bottom: 100 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.formContainer}>
              <View style={styles.headlineContainerMessage}>
                <View style={styles.profilPictureContainer}>
                  {imageUri ? (
                    <Image
                      key={user.imageUri}
                      style={styles.contactProfilPicture}
                      source={{
                        uri: imageUri,
                        cache: 'reload',
                      }}
                    />
                  ) : (
                    <Image
                      style={styles.contactProfilPicture}
                      source={require('../../../assets/images/contact.png')}
                    />
                  )}
                  <View style={styles.ProfilPictureActionContainer}>
                    <TouchableOpacity
                      style={styles.deletetProfilPicture}
                      onPress={deleteProfilPicture}
                      disabled={isLoading || !imageUri}>
                      <FontAwesomeIcon icon={faTrash} color={colors.LIGHT} size={11} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.setProfilPicture}
                      onPress={setProfilPicture}
                      disabled={isLoading}>
                      <FontAwesomeIcon icon={faPlus} color={colors.LIGHT} size={11} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.fieldContainer}>
                <FieldWrapper control={control} schema={schemaForm} />
              </View>
              <View style={styles.action}>
                <ContainedButton
                  title={t('submit')}
                  onPress={handleSubmit(handleProfilSetting)}
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
  },
  headlineContainerMessage: {
    marginTop: 20,
    width: 350,
    alignItems: 'center',
    marginBottom: 40,
    borderRadius: 8,
  },
  contactProfilPicture: {
    width: 90,
    height: 90,
    borderRadius: 5,
  },
  headlineMessage: { color: colors.DARK },
  fieldContainer: { margin: 10, marginBottom: 30, marginTop: 15 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    width: 350,
    textAlign: 'left',
  },
  action: {},
  resetPassword: { color: 'white' },
  setNewProfilPicture: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: colors.DARK,
    left: 70,
    bottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: colors.LIGHT,
    borderWidth: 4,
  },
  touchableStyle: {
    borderRadius: 8,
  },
  profilPictureText: {
    color: colors.DARK,
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  profilPictureContainer: {
    width: 90,
    height: 90,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  ProfilPictureActionContainer: {
    marginTop: 10,
    flexDirection: 'row',
    width: 90,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  deletetProfilPicture: {
    width: 30,
    height: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  setProfilPicture: {
    width: 30,
    height: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default SettingProfilScreen;
