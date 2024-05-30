import React, { useState } from 'react';
import {
  Image,
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

import { DateTime } from 'luxon';

import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faCalendar, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';

import Headline from '../../components/Auth/Headine/Headline';
import live from '../../services/live';
import colors from '../../styles/colors';

export const SellerProfilView = ({ route }) => {
  const [comingLives, setComingLives] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      live
        .getLives()
        .then((res) => res)
        .then((data) => {
          setComingLives(
            data.lives.filter(
              (live) =>
                live.seller_id === route.params.sellerId && live.live_status === 'coming_soon',
            ),
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }, []),
  );
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
                  {route.params.imageUrl ? (
                    <Image
                      resizeMode="contain"
                      style={styles.contactProfilPicture}
                      source={{
                        uri: route.params.imageUrl,
                      }}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      style={styles.contactProfilPicture}
                      source={require('../../../assets/images/contact.png')}
                    />
                  )}
                </View>
              </View>
              <View style={styles.fieldContainer}>
                <View>
                  <Headline title={'Bio'} />
                  <Text style={{ fontSize: 17 }}>{route.params.bio}</Text>
                </View>
                <View>
                  <Headline title={'Liens'} />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <FontAwesomeIcon icon={faLink} color={'black'} size={20} />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 17,
                      }}>
                      {route.params.websiteUrl}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <FontAwesomeIcon icon={faInstagram} color={'black'} size={20} />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 17,
                      }}>
                      {route.params.instagram}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <FontAwesomeIcon icon={faTiktok} color={'black'} size={20} />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 17,
                      }}>
                      {route.params.tiktok}
                    </Text>
                  </View>
                </View>
                <View>
                  <Headline title={'Prochain live'} />
                  {comingLives.length > 0 ? (
                    comingLives.map((comingLive, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 17,
                          marginBottom: 10,
                          fontWeight: '700',
                        }}>
                        <FontAwesomeIcon icon={faCalendar} color={colors.DARK} size={20} />
                        {'   '}
                        {DateTime.fromISO(comingLive.live_date_time).toLocaleString({
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                        {' à '}
                        {DateTime.fromISO(comingLive.live_date_time).toLocaleString(
                          DateTime.TIME_SIMPLE,
                        )}
                      </Text>
                    ))
                  ) : (
                    <Text></Text>
                  )}
                </View>
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
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  headlineMessage: { color: colors.DARK },
  fieldContainer: { width: '90%', height: '100%' },
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

export default SellerProfilView;
