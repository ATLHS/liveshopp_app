import React, { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { DateTime } from 'luxon';

import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

import ContainedButtonSm from '../../components/ContainedButtonSm/ContainedButtonSm';
import NoData from '../../components/NoData/NoData';
import LiveStatus from '../../constants/LiveStatus';
import { setIsJoin, setSellerLives } from '../../redux/slices/livesSlice';
import socket from '../../services/config/clientSocketIoConfig';
import live from '../../services/live';
import colors from '../../styles/colors';

export const OnGoingLive = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const { sellerLives, isGone, isJoin } = useSelector((state) => state.lives);
  const handleViewRef = useRef(null);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const currentLive = sellerLives.find((live) => live.live_status === LiveStatus.LIVE);

  useEffect(() => {}, [sellerLives]);

  useEffect(() => {
    let interval;
    if (isFocused) {
      interval = setInterval(() => {
        handleViewRef.current?.pulse();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      // Initialize Agora engine when the app starts
      if (isGone) {
        goOut();
      }
    }, [isGone]),
  );

  const goLive = async (liveData) => {
    if (isJoin) {
      return;
    }

    try {
      socket.emit('joinChannel', { liveId: liveData._id, user });
      dispatch(setIsJoin(true));
      navigation.navigate('LiveScreen', {
        channelName: liveData.live_name,
        seller_id: liveData.seller_id,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const goOut = async () => {
    try {
      dispatch(setIsJoin(false));
    } catch (e) {
      console.error(e);
    }
  };

  const closeLive = (liveToClose) => {
    setIsLoading(true);
    live
      .closeLive(liveToClose)
      .then((res) => res)
      .then((data) => {
        setIsLoading(false);
        setModalVisible(!modalVisible);
        Toast.show({
          type: 'success',
          text1: data.message,
        });
        dispatch(setSellerLives(data.lives));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Modal animationType="fade" transparent={true} visible={modalVisible}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.60)',
                }}>
                <View
                  style={{
                    height: 130,
                    width: 220,
                    borderRadius: 10,
                    backgroundColor: colors.LIGHT,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: 'center',
                        fontFamily: 'FugazOne-Regular',
                      }}>
                      CLÔTURER LE LIVE :{' '}
                    </Text>
                    <Text style={{ fontSize: 15, margin: 5 }}>
                      {currentLive ? currentLive.live_name : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                    <View style={{ margin: 10, height: 30 }}>
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: 70,
                          backgroundColor: 'black',
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => (currentLive ? closeLive(currentLive) : {})}>
                        <Text
                          style={{
                            color: colors.LIGHT,
                            textAlign: 'center',
                            fontSize: 20,
                          }}>
                          oui
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        margin: 10,
                        borderRadius: 10,
                        height: 30,
                      }}>
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: 70,
                          backgroundColor: 'black',
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text
                          style={{
                            color: colors.LIGHT,
                            textAlign: 'center',
                            fontSize: 20,
                          }}>
                          non
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Modal>
            {currentLive && !isLoading ? (
              <Pressable
                style={styles.onGoingLiveContainer}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <ImageBackground
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0.5,
                  }}
                  source={
                    user.imageUrl
                      ? {
                          uri: user.imageUrl,
                          cache: 'reload',
                        }
                      : require('../../../assets/images/liveshopp_back_lives.png')
                  }>
                  <View style={styles.liveContainer}>
                    <View style={styles.liveContainerInfos}>
                      <View style={styles.liveContainerInfosIcons}>
                        {/*<View*/}
                        {/*  style={{*/}
                        {/*    borderColor: colors.PRIMARY,*/}
                        {/*    borderWidth: 1,*/}
                        {/*    textAlign: 'left',*/}
                        {/*    fontWeight: 'bold',*/}
                        {/*    fontSize: 13,*/}
                        {/*    backgroundColor: colors.PRIMARY,*/}
                        {/*    padding: 4,*/}
                        {/*    paddingRight: 10,*/}
                        {/*    paddingLeft: 10,*/}
                        {/*    borderRadius: 4,*/}
                        {/*  }}>*/}
                        {/*  <Text*/}
                        {/*    style={{*/}
                        {/*      textAlign: 'left',*/}
                        {/*      fontWeight: 'bold',*/}
                        {/*      color: colors.LIGHT,*/}
                        {/*      fontSize: 12,*/}
                        {/*    }}>*/}
                        {/*    En direct*/}
                        {/*  </Text>*/}
                        {/*</View>*/}
                        {/*<Text style={styles.liveContainerUsers}>*/}
                        {/*  <FontAwesomeIcon icon={faUsers} color={colors.LIGHT} size={20} />{' '}*/}
                        {/*  {liveData.userCount}*/}
                        {/*</Text>*/}
                      </View>
                      <View style={styles.liveContainerLiveInfos}>
                        <Text style={styles.title}>{currentLive.live_name}</Text>
                        <Text numberOfLines={5} style={styles.description}>
                          {currentLive.live_description}
                        </Text>
                        <Text style={styles.hour}>
                          {DateTime.fromISO(currentLive.live_date_time).toLocaleString(
                            DateTime.DATE_MED_WITH_WEEKDAY,
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>

                <Animatable.View
                  ref={(ref) => (handleViewRef.current = ref)}
                  easing="ease-out"
                  iterationCount="infinite"
                  style={styles.action}>
                  <ContainedButtonSm
                    title="Rejoindre le live"
                    loading={isLoading}
                    onPress={() => goLive(currentLive)}
                  />
                </Animatable.View>
              </Pressable>
            ) : (
              <NoData
                title={"Vous n'avez aucun live en cours"}
                message={'Un live programmé apparaîtra ici 30 min avant que le show commence.'}
                buttonTitle={'Créer un live maintenant ?'}
                onPress={() => navigation.navigate('SettingNewLive')}
              />
            )}
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveContainerInfos: {
    alignItems: 'center',
  },
  onGoingLiveContainer: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  onGoingLive: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  liveContainer: {
    width: '100%',
    textAlign: 'center',
    height: '85%',
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 15,
  },
  liveContainerUsers: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: colors.LIGHT,
  },
  liveContainerIcon: {
    fontFamily: 'Roboto-Regular',
    fontSize: 25,
    color: colors.LIGHT,
  },
  title: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 25,
    margin: 5,
    alignItems: 'center',
  },
  description: {
    fontSize: 15,
    marginTop: 30,
    color: colors.LIGHT,
    textAlign: 'center',
    width: 300,
  },
  hour: {
    fontSize: 20,
    marginTop: 30,
    fontWeight: '500',
    color: colors.LIGHT,
  },
  liveContainerLiveInfos: {
    alignItems: 'center',
    marginTop: 70,
  },
  action: {
    position: 'absolute',
    left: '50%',
    bottom: '5%',
    marginLeft: -150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveContainerInfosIcons: {
    marginTop: 25,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default OnGoingLive;
