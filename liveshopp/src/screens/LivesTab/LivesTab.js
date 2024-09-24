import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import UserType from '../../constants/UserType';
import { setBlockedUser } from '../../redux/slices/userSlice';
import customer from '../../services/customer';
import live from '../../services/live';
import colors from '../../styles/colors';
import { checkAndUpdateLiveStatus } from '../../utils/checkAndUpdateLiveStatus';
// DO NOT REMOVE : Hiding auction videos feature for now.
import AuctionVideos from '../AuctionVideos/AuctionVideos';
import ComingLives from '../ComingLives/ComingLives';
import LivesScreen from '../LivesScreen/LivesScreen';

const Tab = createMaterialTopTabNavigator();

const LivesTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fiveMinuteInMilliseconds = 300000;

  useFocusEffect(
    React.useCallback(() => {
      let liveInterval;
      live
        .getLives()
        .then((res) => res)
        .then((data) => {
          checkAndUpdateLiveStatus(data.lives, dispatch, UserType.USER);
          liveInterval = setInterval(() => {
            checkAndUpdateLiveStatus(data.lives, dispatch, UserType.USER);
          }, fiveMinuteInMilliseconds); // 5 minutes
        })
        .catch((err) => {
          console.error(err);
        });
      return () => clearInterval(liveInterval);
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      customer
        .getBlockedUser()
        .then((res) => res)
        .then((data) => {
          const sellerIds = data.blockedSeller.map((seller) => seller._id);
          const userIds = data.blockedUser.map((user) => user._id);

          dispatch(
            setBlockedUser({
              blockedUser: userIds,
              blockedSeller: sellerIds,
            }),
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }, []),
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: colors.DARK },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}>
      <Tab.Screen
        options={{
          title: t('liveAuction').toUpperCase(),
        }}
        name="LivesScreen"
        component={LivesScreen}
      />
      {/*DO NOT REMOVE : Hiding auction videos feature for now.*/}
      <Tab.Screen
        options={{
          title: 'VIDÉOS ENCHÈRE',

          swipeEnabled: false,
        }}
        name="AuctionVideos"
        component={AuctionVideos}
      />
      <Tab.Screen
        options={{ title: t('comingSoon').toUpperCase() }}
        name="UpcomingLives"
        component={ComingLives}
      />
    </Tab.Navigator>
  );
};

export default LivesTab;
