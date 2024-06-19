import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionSheetIOS,
  Alert,
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
import { useDispatch, useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';

import customer from '../../services/customer';
import colors from '../../styles/colors';

export const SettingShippingAddress = ({ navigation }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [blockedUser, setBlockedUser] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      customer
        .getBlockedUser()
        .then((res) => res)
        .then((data) => {
          setBlockedUser(data.blockedUser.concat(data.blockedSeller));
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }, []),
  );

  const unblockUser = (data) => {
    setIsLoading(true);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('cancel'), t('unblockUser')],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          return;
        } else if (buttonIndex === 1) {
          customer
            .unblockUser(data)
            .then((res) => res)
            .then((data) => {
              setIsLoading(false);
              Alert.alert('', data.message, [{ text: 'Ok' }]);
              setBlockedUser(blockedUser.filter((blockedId) => blockedId._id !== data.id));
            })
            .catch((err) => {
              setIsLoading(false);
              Alert.alert('', err.message, [{ text: 'Ok' }]);
            });
        }
      },
    );
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
              {blockedUser.map((blocked, id) => (
                <TouchableOpacity key={id} onPress={() => unblockUser(blocked)}>
                  <View
                    style={{
                      padding: 7,
                      width: 350,
                      backgroundColor: colors.LIGHT,
                      margin: 5,
                      borderRadius: 5,
                      borderColor: colors.DARK,
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        color: colors.DARK,
                        margin: 2,
                        fontFamily: 'Roboto-Regular',
                        fontSize: 15,
                      }}>
                      <Text
                        style={{
                          color: colors.DARK,
                          margin: 2,
                          fontFamily: 'Roboto-Regular',
                          fontWeight: '500',
                          fontSize: 15,
                        }}>
                        Pseudo :{' '}
                      </Text>
                      {blocked.company_name || blocked.firstname}
                    </Text>
                    <Text
                      style={{
                        color: colors.DARK,
                        margin: 2,
                        fontSize: 15,
                      }}>
                      <Text
                        style={{
                          color: colors.DARK,
                          margin: 2,
                          fontFamily: 'Roboto-Regular',
                          fontWeight: '500',
                          fontSize: 15,
                        }}>
                        Profil :{' '}
                      </Text>
                      {blocked.profil === 'seller' ? t('seller') : t('user')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
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
    marginTop: 20,
  },
  places: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 3,
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
    top: 100,
  },
  resetPassword: { color: 'white' },
});

export default SettingShippingAddress;
