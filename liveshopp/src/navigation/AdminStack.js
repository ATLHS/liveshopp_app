import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheetIOS, Alert, Pressable, StatusBar, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons/faUserMinus';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { setIsGone, setIsJoin, setLiveData } from '../redux/slices/livesSlice';
import AdminBlockedUsers from '../screens/AdminBlockedUsers/AdminBlockedUsers';
import AdminSignaledUsers from '../screens/AdminSignaledUsers/AdminSignaledUsers';
import AdminStacks from '../screens/AdminStacks/AdminStacks';
import LiveScreen from '../screens/LiveScreen/LiveScreen';
import rgpdScreen from '../screens/Rgpd/Rgpd';
import SettingProfilScreen from '../screens/SettingProfilScreen/SettingProfilScreen';
import admin from '../services/admin';
import socket from '../services/config/clientSocketIoConfig';
import colors from '../styles/colors';

const Stack = createNativeStackNavigator();

const SellerStack = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.user);
  const liveData = useSelector((state) => state.lives.liveData);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

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

  const leaveRoom = () => {
    socket.emit('leaveRoom', { liveId: liveData.auctionId, sellerId: liveData.sellerId, user });
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
    navigation.navigate('LivesScreen');
  };

  const updateExtraUserCount = (count) => {
    admin.updateExtraUserCount(liveData.auctionId, count);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureDirection: 'vertical',
      }}>
      <Stack.Screen name="AdminStacks" component={AdminStacks} />
      <Stack.Screen
        name="SettingProfilScreen"
        component={SettingProfilScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: t('editProfile'),
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="AdminBlockedUsers"
        component={AdminBlockedUsers}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: t('blockedUsersOnLiveshopp'),
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="AdminSignaledUsers"
        component={AdminSignaledUsers}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: t('reportedUsersOnLiveshopp'),
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="LiveScreen"
        component={LiveScreen}
        options={() => ({
          gestureEnabled: false,
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerTransparent: true,
          navigationOptions: {
            gesturesEnabled: false,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faUsers} color={colors.LIGHT} size={18} />
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 5,
                    color: colors.LIGHT,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {liveData && liveData.userCount} (+{(liveData && liveData.extraUserCount) || 0})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => updateExtraUserCount(-1)}
                style={{ paddingLeft: 15 }}>
                <FontAwesomeIcon icon={faUserMinus} color={colors.LIGHT} size={25} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateExtraUserCount(1)} style={{ paddingLeft: 15 }}>
                <FontAwesomeIcon icon={faUserPlus} color={colors.LIGHT} size={25} />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <Pressable onPress={() => leaveRoom()}>
              <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30} />
            </Pressable>
          ),
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.LIGHT,
                  fontFamily: 'Roboto-Regular',
                  marginRight: 5,
                }}>
                {liveData.sellerName}
              </Text>
              {!(user.id === liveData.sellerId) && (
                <TouchableOpacity onPress={() => showObjectionableAdminAction(liveData)}>
                  <FontAwesomeIcon icon={faEllipsisVertical} color={colors.LIGHT} size={17} />
                </TouchableOpacity>
              )}
            </View>
          ),
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            color: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="rgpdScreen"
        component={rgpdScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: t('termsAndConditions'),
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default SellerStack;
