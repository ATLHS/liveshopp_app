import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  createAgoraRtcEngine,
} from 'react-native-agora';
import { LinearGradient } from 'react-native-gradients';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { DateTime } from 'luxon';

import { REACT_APP_AGORA_APP_ID } from '@env';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';

import LiveAuctionForm from '../../components/LiveAuctionForm/LiveAuctionForm';
import LiveAuctionInfo from '../../components/LiveAuctionInfo/LiveAuctionInfo';
import LiveChatMessagesList from '../../components/LiveChatMessagesList/LiveChatMessagesList';
import LiveChatTextInput from '../../components/LiveChatTextInput/LiveChatTextInput';
import AccountSetupModal from '../../components/LiveScreen/AccountSetupModal';
import CameraSwitch from '../../components/LiveScreen/CameraSwitch';
import SellerLiveForm from '../../components/SellerLiveForm/SellerLiveForm';
import admin from '../../services/admin';
import socket from '../../services/config/clientSocketIoConfig';
import customer from '../../services/customer';
import live from '../../services/live';
import colors from '../../styles/colors';

export const LiveScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { channelName, seller_id } = route.params;
  const { liveData } = useSelector((state) => state.lives);
  const { user } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);

  /** @type {import("react").MutableRefObject<IRtcEngine | null>} */
  const agoraEngineRef = useRef(null);
  const panelRef = useRef(null);

  const [isHost] = useState(user.id === seller_id);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);

  // Prevent app to dim or go to sleep during a live
  useKeepAwake();

  const setupVideoSDKEngine = async () => {
    try {
      if (agoraEngineRef.current) {
        return;
      }

      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          console.log(`[AGORA] ${user.email} joined the channel: ${channelName}`);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          console.log(`[AGORA] ${user.email} Remote user joined with uid: ${Uid}`);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          console.log(`[AGORA] ${user.email} Remote user left the channel with uid: ${Uid}`);
          setRemoteUid(0);
        },
      });

      agoraEngine.initialize({
        appId: REACT_APP_AGORA_APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      agoraEngine.enableVideo();
    } catch (e) {
      console.error(e);
    }
  };

  // Gracefully quit and destroy the Agora engine
  const releaseSDKEngine = () => {
    try {
      setRemoteUid(0);
      setIsJoined(false);

      agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.stopPreview();

      // FIXME Android seems to crash on release()
      agoraEngineRef.current?.release();
    } catch (error) {
      console.log(error);
    }
  };

  const joinLiveBroadcast = async () => {
    try {
      if (isJoined) {
        return;
      }

      const { token } = await live.getAgoraToken(channelName);

      if (isHost) {
        agoraEngineRef.current?.startPreview();
        const status = agoraEngineRef.current?.joinChannel(token, channelName, 0, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });

        if (status === -17) {
          console.warn('[AGORA] Host already joined the Agora channel');
          setIsJoined(true);
        }
      } else {
        const status = agoraEngineRef.current?.joinChannel(token, channelName, 0, {
          clientRoleType: ClientRoleType.ClientRoleAudience,
        });

        if (status === -17) {
          console.warn('[AGORA] Viewer already joined the Agora channel');
          setIsJoined(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (liveData.currentAuction.currentAuctionStatus === 'stopping') {
        showCurrentLiveNotificationToast();
      }
    }, [liveData.currentAuction.currentAuctionStatus]),
  );

  useEffect(() => {
    if (!isHost && user.profil !== 'admin') {
      if (!user.hasValidPaymentMethod || !user.shipping_address) {
        setModalVisible(true);
      }
    }
  }, [user.hasValidPaymentMethod, user.shipping_addres]);

  // Start the engine
  useEffect(() => {
    // Initialize Agora engine when the app starts
    setupVideoSDKEngine();
    // Start broadcasting or viewing
    joinLiveBroadcast();

    return () => {
      releaseSDKEngine();
    };
  }, []);

  const startCurrentAuction = (channelName, data) => {
    socket.emit('startCurrentAuction', { channelName, data });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const switchCamera = () => {
    agoraEngineRef.current?.switchCamera();
  };

  const showCurrentLiveNotificationToast = () => {
    // if user win we must have a userid
    if (liveData.currentAuction.userId) {
      Toast.show({
        type: 'auctionToast',
        text1: `${t('soldTo')} ${liveData.currentAuction.username}  🎉`,
        topOffset: 100,
      });
    }
    if (!liveData.currentAuction.userId) {
      Toast.show({
        type: 'auctionToast',
        text1: t('auctionsEnded'),
        topOffset: 100,
      });
    }
    socket.emit('pausedCurrentAuctionStatut', liveData.channelName);
  };

  const bidOnCurrentAuction = (channelName, data) => {
    data.username = `${user.firstname} ${user.lastname.charAt(0)}`;
    data.userId = user.id;
    data.shipping_address = user.shipping_address;
    // send current bid info
    socket.emit('bid', { channelName, data });
  };

  const emitNewLiveMessage = (message) => {
    socket.emit('newLiveMessage', { user, message, channelName });
  };

  const showObjectionableAction = (item) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('cancel'), t('blockUser'), t('reportUser')],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          return;
        } else if (buttonIndex === 1) {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [t('cancel'), t('blockUser')],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 0,
              userInterfaceStyle: 'light',
              title: t('stop_seeing_messages'),
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                return;
              } else if (buttonIndex === 1) {
                // block user
                socket.emit('blockCustomer', {
                  user,
                  userId: item.userId,
                  profil: item.profil,
                });
              }
            },
          );
        } else if (buttonIndex === 2) {
          // signal user
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [t('cancel'), t('reportUser')],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 0,
              userInterfaceStyle: 'light',
              title: t('behaviorNotAllowed'),
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                return;
              } else if (buttonIndex === 1) {
                // block user
                customer
                  .signalCustomer({
                    item,
                    flag_type: 'message',
                    liveData,
                  })
                  .then((res) => res)
                  .then((data) => {
                    Alert.alert('', data.message, [{ text: 'OK' }]);
                  })
                  .catch((err) => {
                    Alert.alert('', err.message, [{ text: 'OK' }]);
                  });
              }
            },
          );
        }
      },
    );
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
              Alert.alert('', data.message, [{ text: 'OK' }]);
            })
            .catch((err) => {
              Alert.alert('', err.message, [{ text: 'OK' }]);
            });
        }
      },
    );
  };

  const renderLiveUserActions = () => {
    // TO DO: find a better way for when the seller's stream is interrupted during an ongoing auction
    if (liveData.currentAuction.currentAuctionStatus === 'running') {
      return (
        <>
          <LiveAuctionInfo />
          {user.profil !== 'admin' && !isHost && (
            <LiveAuctionForm
              liveData={liveData}
              onPress={(data) => bidOnCurrentAuction(liveData.channelName, data)}
            />
          )}
        </>
      );
    } else {
      return (
        isHost && (
        <SellerLiveForm
          onPress={(data) => startCurrentAuction(liveData.channelName, data)}
          currentAuctionIsRunning={liveData.currentAuction.currentAuctionStatus === 'running'}
          panelRef={panelRef}
        />
        )
      );
    }
  };

  return (
    <View style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={liveData.hostIsLive ? styles.ready : styles.waiting}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {!liveData.hostIsLive && (
            <View style={styles.waitingLiveMessage}>
              <Text style={styles.channelName}>{liveData.channelName}</Text>
              <View style={styles.liveStatus}>
                {liveData.auctionsStatus === 'coming_soon' ? (
                  <>
                    <View style={styles.liveScheduleContainer}>
                      <Text style={styles.liveSchedule}>
                        {DateTime.fromISO(liveData.liveSchedule).toLocaleString({
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                        {t('at')}
                        {DateTime.fromISO(liveData.liveSchedule).toLocaleString(
                          DateTime.TIME_SIMPLE,
                        )}
                      </Text>
                    </View>
                    <View style={styles.liveScheduleContainer}>
                      <Text style={styles.waitingDescription}>{t('askSeller')}</Text>
                    </View>
                    <View style={styles.liveScheduleContainer}>
                      <FontAwesomeIcon icon={faArrowDown} size={25} color={colors.LIGHT} />
                    </View>
                  </>
                ) : (
                  <Text style={{ color: colors.LIGHT }}>{t('liveStartingSoon')}</Text>
                )}
              </View>
            </View>
          )}

          {isJoined && !isHost && liveData.hostIsLive ? (
            <Fragment key={remoteUid}>
              <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.videoView} />
            </Fragment>
          ) : (
            isHost &&
            isJoined && (
              <Fragment key={0}>
                <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
              </Fragment>
            )
          )}

          <View style={styles.chatContainer}>
            {liveData.messages && liveData.messages.length > 0 && (
              <LiveChatMessagesList
                messages={liveData.messages}
                user={user}
                showObjectionableAction={showObjectionableAction}
                showObjectionableAdminAction={showObjectionableAdminAction}
              />
            )}
            {renderLiveUserActions()}
            {!isHost && <LiveChatTextInput onPress={(message) => emitNewLiveMessage(message)} />}
          </View>

          <View style={styles.shadowGradient}>
            <LinearGradient colorList={colorList} angle={90} />
          </View>
          <AccountSetupModal profile={user.profile} visible={modalVisible} onPress={closeModal} />
          {isHost && <CameraSwitch onPress={switchCamera} />}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const colorList = [
  { offset: '20%', color: 'transparent', opacity: '0' },
  { offset: '0%', color: 'black', opacity: '0.6' },
  { offset: '90%', color: 'transparent', opacity: '0' },
  { offset: '100%', color: 'black', opacity: '0.6' },
];

const styles = StyleSheet.create({
  chatContainer: {
    position: 'absolute',
    // Resolve chat input field hidden when keyboard is opened on Android devices
    bottom: Platform.OS === 'ios' ? 30 : 60,
    width: '95%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  ready: {
    flex: 1,
    backgroundColor: 'black',
  },
  waiting: {
    flex: 1,
    backgroundColor: '#262626',
  },
  scroll: { flex: 1 },
  scrollContainer: { flex: 1 },
  videoView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute',
    zIndex: 1,
  },
  waitingLiveMessage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100,
    marginHorizontal: 20,
  },
  channelName: {
    color: colors.LIGHT,
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  liveStatus: {
    color: colors.LIGHT,
    fontSize: 17,
    textAlign: 'center',
    padding: 20,
  },
  liveScheduleContainer: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveSchedule: {
    fontSize: 25,
    fontWeight: '600',
    color: colors.LIGHT,
  },
  shadowGradient: {
    position: 'absolute',
    zIndex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  waitingDescription: {
    textAlign: 'center',
    color: colors.LIGHT,
    margin: 'auto',
  },
});

export default LiveScreen;
