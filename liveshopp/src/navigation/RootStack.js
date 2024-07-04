import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Appearance, Linking, Platform } from 'react-native';
import { checkVersion } from 'react-native-check-version';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { APP_STORE_BUNDLE_ID, PLAY_STORE_BUNDLE_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import {
  setCurrentAuction,
  setIsGone,
  setIsJoin,
  setLiveData,
  setLives,
  setNewChatMessage,
} from '../redux/slices/livesSlice';
import { setBlockedUser, setIsAuthenticate, setUser } from '../redux/slices/userSlice';
import Loading from '../screens/Loading/Loading';
import axiosConfig from '../services/config/axiosConfig';
import socket from '../services/config/clientSocketIoConfig';
import AdminStack from './AdminStack';
import AuthStack from './AuthStach';
import SellerStack from './SellerStack';
import UserStack from './UserStack';

const RootStack = ({ isLoading }) => {
  const { liveData } = useSelector((state) => state.lives);
  const { user } = useSelector((state) => state.user);
  const isAuthenticate = useSelector((state) => state.user.isAuthenticate);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  // Force light them since dark mode is not well implemented yet
  // and can lead to invisible text (reported by users on Android with dark mode enabled)
  Appearance.setColorScheme('light');

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const version = await checkVersion({
          platform: Platform.OS,
          country: 'fr',
          bundleId: Platform.OS === 'ios' ? APP_STORE_BUNDLE_ID : PLAY_STORE_BUNDLE_ID,
        });

        if (__DEV__) {
          console.log('App is running in dev mode =', __DEV__);
          return;
        }

        if (version.needsUpdate) {
          Alert.alert(
            t('updateRequired'),
            t('newAppVersionAvailable'),
            [
              {
                text: t('update'),
                onPress: () => {
                  Linking.openURL(version.url);
                },
              },
            ],
            { cancelable: false },
          );
        }
      } catch (error) {
        console.error('Failed to check for updates: ', error);
      }
    };

    checkForUpdates();
  }, []);

  useEffect(() => {
    if (isAuthenticate) {
      AsyncStorage.getItem('@token').then((token) => {
        axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
      });
    }
  }, [isAuthenticate]);

  const logOutUser = async (data) => {
    try {
      if (data.updatedCustomer._id === user.id) {
        socket.emit('leaveRoom', {
          liveData: data.liveData.liveData,
          user: data.updatedCustomer,
        });
        dispatch(setIsJoin(false));
        dispatch(setIsGone(true));
        Toast.hide();
        dispatch(
          setLiveData({
            channelName: '',
            sellerId: '',
            auctionId: '',
            auctionsStatus: '',
            userCount: '',
            messages: [],
            currentAuction: {
              userId: '',
              username: '',
              productName: false,
              currentProductAmount: '',
              currentAuctionTimer: '',
              currentAuctionStatus: '',
              salePrice: '',
            },
          }),
        );
        await AsyncStorage.removeItem('@token');
        dispatch(setIsAuthenticate(false));
        dispatch(setUser({ profil: null }));
      }
    } catch (error) {
      console.error(e);
    }
  };

  useEffect(() => {
    function onConnect() {
      console.log('[SOCKET.IO] Connected with websocket ID', socket.id);
    }

    function onDisconnect(reason) {
      console.warn('Disconnected for reason:', reason);

      if (socket.active) {
        // temporary disconnection, the socket will automatically try to reconnect
        console.log('[SOCKET.IO] Socket is still active, trying to reconnect automatically');
      } else {
        // the connection was forcefully closed by the server or the client itself
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.warn('[SOCKET.IO] Socket is not active');
      }
    }

    function onConnectError(error) {
      console.warn('[SOCKET.IO] Connect error', error);

      if (socket.active) {
        // temporary failure, the socket will automatically try to reconnect
      } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(error.message);
      }
    }

    // Manager
    function onError(error) {
      console.warn('[SOCKET.IO] Socket error', error);
    }

    function onReconnect(attempt) {
      console.log(`[SOCKET.IO] Succesfully reconnected after ${attempt} tries`);

      // if we are in a live, rejoin the chat room
      if (liveData?.auctionId) {
        console.log('[SOCKET.IO] Rejoining current channel chat', liveData.channelName);
        socket.emit('joinChannel', { liveId: liveData.auctionId, user });
      }
    }

    function onReconnectError(error) {
      console.warn('[SOCKET.IO] Reconnect error', error);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    // Manager
    socket.io.on('error', onError);
    socket.io.on('reconnect', onReconnect);
    socket.io.on('reconnect_error', onReconnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);

      // Manager
      socket.io.off('error', onError);
      socket.io.off('reconnect', onReconnect);
      socket.io.off('reconnect_error', onReconnectError);
    };
  }, [liveData, user]);

  useEffect(() => {
    const onBanUser = (data) => {
      logOutUser(data);
    };

    const onChannelData = (channelData) => {
      dispatch(setLiveData(channelData));
    };

    const onCurrentAuctionData = (currentAuction) => {
      dispatch(setCurrentAuction(currentAuction));
    };

    const onFreshLives = ({ freshLives }) => {
      dispatch(setLives(freshLives));
    };

    const onHasBeenBlocked = (blockedInfo) => {
      dispatch(setBlockedUser(blockedInfo));
    };

    const onNewChatMessage = (message) => {
      dispatch(setNewChatMessage(message));
    };

    socket.on('banUser', onBanUser);
    socket.on('channelData', onChannelData);
    socket.on('currentAuctionData', onCurrentAuctionData);
    socket.on('freshLives', onFreshLives);
    socket.on('hasBeenBlocked', onHasBeenBlocked);
    socket.on('newChatMessage', onNewChatMessage);

    return () => {
      socket.off('banUser');
      socket.off('channelData');
      socket.off('currentAuctionData');
      socket.off('freshLives');
      socket.off('hasBeenBlocked');
      socket.off('newChatMessage');
    };
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoading ? (
        <Loading />
      ) : !isAuthenticate ? (
        <AuthStack />
      ) : user.profil === 'admin' ? (
        <AdminStack />
      ) : user.profil === 'seller' ? (
        <SellerStack />
      ) : (
        <UserStack />
      )}
    </NavigationContainer>
  );
};

export default RootStack;
