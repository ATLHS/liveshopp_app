import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { checkVersion } from 'react-native-check-version';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { APP_STORE_BUNDLE_ID, PLAY_STORE_BUNDLE_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import { setIsGone, setIsJoin, setLiveData } from '../redux/slices/livesSlice';
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

  useEffect(() => {
    // FIXME
    //
    // Previously, we used the deprecated `react-native-version-app`
    // Now it's temporarily hardcoded to remove the package.
    // We should find a better solution.
    //
    const currentVersion = '1.2.0';
    const fetchData = async () => {
      const version = await checkVersion({
        platform: Platform.OS,
        country: 'fr',
        bundleId: Platform.OS === 'ios' ? APP_STORE_BUNDLE_ID : PLAY_STORE_BUNDLE_ID,
        currentVersion,
      });

      if (__DEV__) {
        console.log('App is running in dev mode =', __DEV__);
        return;
      }

      if (version.needsUpdate) {
        Alert.alert(
          'Mise à jour requise',
          "Une nouvelle version de l'application est disponible. Veuillez mettre à jour pour continuer à utiliser l'application.",
          [
            {
              text: 'Mettre à jour',
              onPress: () => {
                Linking.openURL(version.url);
              },
            },
          ],
          { cancelable: false },
        );
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticate) {
      AsyncStorage.getItem('@token').then((token) => {
        axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
      });
    }
  }, [isAuthenticate]);

  socket.on('banUser', async (data) => {
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
              currentAuctionDelay: '',
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
  });

  socket.on('hasBeenBlocked', (blockedInfo) => {
    try {
      dispatch(setBlockedUser(blockedInfo));
    } catch (error) {
      console.error(e);
    }
  });

  socket.on('channelData', (channelData) => {
    try {
      dispatch(setLiveData(channelData));
    } catch (error) {
      console.error(e);
    }
  });

  socket.on('currentAuctionData', async (channelData) => {
    try {
      dispatch(setLiveData(channelData));
    } catch (e) {
      console.error(e);
    }
  });

  useEffect(() => {
    function onConnect() {
      console.log('Connected with websocket ID', socket.id);
    }

    function onDisconnect(reason) {
      console.warn('Disconnected for reason:', reason);

      if (socket.active) {
        // temporary disconnection, the socket will automatically try to reconnect
        console.log('Socket is still active, trying to reconnect automatically');
      } else {
        // the connection was forcefully closed by the server or the client itself
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.warn('Socket is not active');
      }
    }

    function onConnectError(error) {
      console.warn('Connect error', error);

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
      console.warn('Socket error', error);
    }

    function onReconnect(attempt) {
      console.log(`Succesfully reconnected after ${attempt} tries`);

      // if we are in a live, rejoin the chat room
      if (liveData?.auctionId) {
        console.log('Rejoining current channel chat', liveData.channelName);
        const liveId = { _id: liveData?.auctionId };
        socket.emit('joinChannel', { liveData: liveId, user });
      }
    }

    function onReconnectError(error) {
      console.warn('Reconnect error', error);
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
