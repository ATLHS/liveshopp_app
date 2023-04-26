import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserStacks from '../screens/UserStacks/UserStacks';
import SettingProfilScreen from '../screens/SettingProfilScreen/SettingProfilScreen';
import colors from '../styles/colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import {Pressable, Text, View} from 'react-native';
import LiveScreen from '../screens/LiveScreen/LiveScreen';
import {faUsers} from '@fortawesome/free-solid-svg-icons/faUsers';
import {setIsGone, setIsJoin, setLiveData} from '../redux/slices/livesSlice';
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark';
import {useDispatch, useSelector} from 'react-redux';
import SettingShippingAddress from '../screens/SettingShippingAddress/SettingShippingAddress';
import socket from '../services/config/clientSocketIoConfig';
import React from 'react';
import rgpdScreen from '../screens/Rgpd/Rgpd';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const UserStack = () => {
  const user = useSelector(state => state.user.user);
  const liveData = useSelector(state => state.lives.liveData);
  const dispatch = useDispatch();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureDirection: 'vertical',
      }}>
      <Stack.Screen
        name="UserStacks"
        component={UserStacks}
        options={({navigation}) => ({
          headerShown: false,
          title: 'User stack',
          headerStyle: {
            backgroundColor: colors.DARK,
            color: 'white',
          },
        })}
      />
      <Stack.Screen
        name="SettingProfilScreen"
        component={SettingProfilScreen}
        options={({navigation}) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon
                icon={faAngleLeft}
                color={colors.DARK}
                size={30}
              />
            </Pressable>
          ),
          title: '',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="SettingShippingAddress"
        component={SettingShippingAddress}
        options={({navigation}) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon
                icon={faAngleLeft}
                color={colors.DARK}
                size={30}
              />
            </Pressable>
          ),
          title: '',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
      <Stack.Screen
        name="LiveScreen"
        component={LiveScreen}
        options={({navigation}) => ({
          gestureEnabled: false,
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerTransparent: true,
          navigationOptions: {
            gesturesEnabled: false,
          },
          headerLeft: () => (
            <View style={{alignItems: 'center'}}>
              <FontAwesomeIcon icon={faUsers} color={colors.LIGHT} size={18} />
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 5,
                  color: colors.LIGHT,
                  fontFamily: 'Roboto-Regular',
                  fontWeight: 'bold',
                }}>
                {liveData && liveData.userCount}
              </Text>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                socket.emit('leaveRoom', {liveData, user});
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
                navigation.pop();
              }}>
              <FontAwesomeIcon icon={faXmark} color={colors.LIGHT} size={30} />
            </Pressable>
          ),
          title: liveData.sellerName,
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
        options={({navigation}) => ({
          headerShown: true,
          headerShadowVisible: false, // applied here
          headerLeft: () => (
            <Pressable onPress={() => navigation.pop()}>
              <FontAwesomeIcon
                icon={faAngleLeft}
                color={colors.DARK}
                size={30}
              />
            </Pressable>
          ),
          title: '',
          headerStyle: {
            backgroundColor: colors.LIGHT,
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default UserStack;
