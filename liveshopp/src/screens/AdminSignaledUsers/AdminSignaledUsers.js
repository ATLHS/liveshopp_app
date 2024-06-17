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

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';

import admin from '../../services/admin';
import colors from '../../styles/colors';

export const AdminSignaledUsers = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [flaggedUsers, setFlaggedUser] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      initFlaggedUser();
    }, []),
  );

  const initFlaggedUser = () => {
    admin
      .getFlaggedUsers()
      .then((res) => res)
      .then((data) => {
        /*if (data.flaggedUsers.length) {*/
        setFlaggedUser(data.flaggedUsers);
        /*}*/
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const showObjectionableAdminAction = (data) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('cancel'), t('banUser')],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          return;
        } else if (buttonIndex === 1) {
          admin
            .banUser(data)
            .then((res) => res)
            .then((data) => {
              initFlaggedUser();
              Alert.alert('', data.message, [{ text: 'OK' }]);
            })
            .catch((err) => {
              Alert.alert('', err.message, [{ text: 'OK' }]);
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
              {flaggedUsers.length ? (
                flaggedUsers
                  .filter((flagged) => flagged.isBlocked === false)
                  .map((flagged, id) => (
                    <TouchableOpacity
                      key={id}
                      style={styles.touchableStyle}
                      onPress={() =>
                        showObjectionableAdminAction({
                          liveData: flagged.live_data,
                          flag_user_id: flagged.flag_user_id,
                        })
                      }>
                      <View
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
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
                              {t('username')} :{' '}
                            </Text>
                            {flagged.flag_user_username}
                          </Text>
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
                              {t('reportType')} :{' '}
                            </Text>
                            {flagged.flag_type}
                          </Text>
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
                              {flagged.flag_livename ? t('reportedLive') : t('reportedMessage')} :{' '}
                            </Text>
                            {flagged.flag_livename ? flagged.flag_livename : flagged.flag_message}
                          </Text>
                        </View>
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          size={20}
                          color={colors.PRIMARY}
                        />
                      </View>
                    </TouchableOpacity>
                  ))
              ) : (
                <View />
              )}
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
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    borderColor: colors.DARK,
    borderWidth: 1,
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default AdminSignaledUsers;
