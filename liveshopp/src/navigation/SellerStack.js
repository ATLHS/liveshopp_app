import React, { useEffect } from 'react';
import { ActionSheetIOS, Alert, Pressable, StatusBar, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { faEllipsisVertical, faEye } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { setIsGone, setIsJoin, setLiveData } from '../redux/slices/livesSlice';
import BidConfirmationScreen from '../screens/BidConfirmationScreen/BidConfirmationScreen';
import BlockedUsers from '../screens/BlockedUsers/BlockedUsers';
import LiveScreen from '../screens/LiveScreen/LiveScreen';
import rgpdScreen from '../screens/Rgpd/Rgpd';
import SellerProfilView from '../screens/SellerProfilView/SellerProfilView';
import SellerStacks from '../screens/SellerStacks/SellerStacks';
// DO NOT REMOVE : Hiding auction videos feature for now.
// import SetNewAuctionVideo from '../screens/SetNewAuctionVideo/SetNewAuctionVideo';
import SettingNewLive from '../screens/SettingNewLive/SettingNewLive';
import SettingProfilScreen from '../screens/SettingProfilScreen/SettingProfilScreen';
import SettingShippingAddress from '../screens/SettingShippingAddress/SettingShippingAddress';
import socket from '../services/config/clientSocketIoConfig';
import customer from '../services/customer';
import colors from '../styles/colors';

{
  /*DO NOT REMOVE : Hiding auction videos feature for now.*/
}

const Stack = createNativeStackNavigator();

const SellerStack = () => {
  const user = useSelector((state) => state.user.user);
  const liveData = useSelector((state) => state.lives.liveData);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const leaveRoom = () => {
    socket.emit('leaveRoom', { liveData, user });
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
    navigation.goBack();
  };

  const showObjectionableAction = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Annuler', 'Bloquer cet utilisateur', 'Signaler cet utilisateur'],
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
              options: ['Annuler', 'Bloquer cet utilisateur'],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 0,
              userInterfaceStyle: 'light',
              title: 'Vous ne verrez plus les messages et les lives de cet utilisateur',
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                return;
              } else if (buttonIndex === 1) {
                // block user
                socket.emit('blockCustomer', {
                  user,
                  userId: liveData.sellerId,
                  profil: 'seller',
                });
                leaveRoom();
              }
            },
          );
        } else if (buttonIndex === 2) {
          // signal user
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Annuler', 'Signaler cet utilisateur'],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 0,
              userInterfaceStyle: 'light',
              title: 'Tout comportement ne respectant pas les conditions générales sera sanctionné',
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                return;
              } else if (buttonIndex === 1) {
                customer
                  .signalCustomer({
                    liveData,
                    flag_type: 'live',
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

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureDirection: 'vertical',
      }}>
      <Stack.Screen name="SellerStacks" component={SellerStacks} />
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
          title: 'Modifier mon profil',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="SellerProfilView"
        component={SellerProfilView}
        options={({ route, navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.pop();
              }}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: route.params.title || '',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="SettingShippingAddress"
        component={SettingShippingAddress}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: 'Adresse de livraison',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="BlockedUsers"
        component={BlockedUsers}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: 'Utilisateur bloqués',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="SettingNewLive"
        component={SettingNewLive}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />
            </Pressable>
          ),
          title: 'Créer un nouveau live',
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
          title: '',
          navigationOptions: {
            gesturesEnabled: false,
          },
          headerLeft: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 28,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.LIGHT,
                  fontFamily: 'Roboto-Regular',
                  marginRight: 5,
                  fontWeight: '500',
                }}>
                {liveData.sellerName}
              </Text>
              {!(user.id === liveData.sellerId) && (
                <TouchableOpacity onPress={() => showObjectionableAction(liveData.sellerId)}>
                  <FontAwesomeIcon icon={faEllipsisVertical} color={colors.LIGHT} size={17} />
                </TouchableOpacity>
              )}
            </View>
          ),
          headerRight: () => (
            <>
              {liveData.hostIsLive && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 25,
                    borderRadius: 3,
                    backgroundColor: colors.PRIMARY,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.LIGHT,
                      fontFamily: 'Roboto-Regular',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    EN DIRECT
                  </Text>
                </View>
              )}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: 60,
                  height: 25,
                  borderRadius: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  marginRight: 10,
                }}>
                <FontAwesomeIcon icon={faEye} color={colors.LIGHT} size={10} />
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.LIGHT,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                    marginLeft: 6,
                  }}>
                  {liveData && liveData.userCount}
                </Text>
              </View>
              <Pressable onPress={() => leaveRoom()}>
                <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30} />
              </Pressable>
            </>
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
          title: 'Conditions générales',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      {/*DO NOT REMOVE : Hiding auction videos feature for now.*/}
      {/*<Stack.Screen*/}
      {/*  name="auctionVideoSettings"*/}
      {/*  component={SetNewAuctionVideo}*/}
      {/*  options={({ navigation }) => ({*/}
      {/*    headerShown: true,*/}
      {/*    headerShadowVisible: false, // applied here*/}
      {/*    headerLeft: () => (*/}
      {/*      <Pressable onPress={() => navigation.pop()}>*/}
      {/*        <FontAwesomeIcon icon={faAngleLeft} color={colors.DARK} size={30} />*/}
      {/*      </Pressable>*/}
      {/*    ),*/}
      {/*    title: 'Enchère vidéo',*/}
      {/*    headerStyle: {*/}
      {/*      backgroundColor: colors.LIGHT,*/}
      {/*    },*/}
      {/*  })}*/}
      {/*/>*/}
      <Stack.Screen
        name="BidConfirmationScreen"
        component={BidConfirmationScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerRight: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon icon={faXmark} color={colors.DARK} size={30} />
            </Pressable>
          ),
          headerLeft: () => '',
          title: '',
        })}
      />
    </Stack.Navigator>
  );
};

export default SellerStack;
