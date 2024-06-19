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

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';

import admin from '../../services/admin';
import colors from '../../styles/colors';

export const AdminBlockedUsers = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [blockedUser, setBlockedUser] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      admin
        .getBannedUsers()
        .then((res) => res)
        .then((data) => {
          if (data.bannedUsers.length) {
            setBlockedUser(data.bannedUsers);
          }
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
          admin
            .unbanUser(data)
            .then((res) => res)
            .then((data) => {
              setIsLoading(false);
              Alert.alert('', data.message, [{ text: 'Ok' }]);
              setBlockedUser(data.bannedUsers);
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
                <TouchableOpacity
                  key={id}
                  style={styles.touchableStyle}
                  onPress={() => unblockUser(blocked)}>
                  <View
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View>
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
                          {t('username')} :{' '}
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
                          {t('profile')} :{' '}
                        </Text>
                        {blocked.profil === 'seller' ? t('seller') : t('user')}
                      </Text>
                    </View>
                    <FontAwesomeIcon icon={faLock} size={20} color={colors.DARK} />
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
  title: {
    color: colors.DARK,
    textAlign: 'left',
    fontSize: 17,
  },
  touchableStyle: {
    width: 350,
    height: 60,
    marginTop: 10,
    marginBottom: 10,
    borderColor: colors.DARK,
    borderWidth: 1,
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default AdminBlockedUsers;
