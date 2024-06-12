import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import UserType from '../../constants/UserType';
import seller from '../../services/seller';
import colors from '../../styles/colors';
import { checkAndUpdateLiveStatus } from '../../utils/checkAndUpdateLiveStatus';
import ComingSoonLives from './ComingSoonLives';
import EndedLives from './EndedLives';
import OnGoingLive from './OnGoingLive';
import SellerAuctionVideos from './SellerAuctionVideos';

const Tab = createMaterialTopTabNavigator();

const SellerLiveTab = () => {
  const dispatch = useDispatch();
  const fiveMinuteInMilliseconds = 300000;

  useFocusEffect(
    React.useCallback(() => {
      let liveInterval;
      seller
        .getSellerLives()
        .then((res) => res)
        .then((data) => {
          checkAndUpdateLiveStatus(data.sellerLives, dispatch, UserType.SELLER);
          liveInterval = setInterval(() => {
            checkAndUpdateLiveStatus(data.sellerLives, dispatch, UserType.SELLER);
          }, fiveMinuteInMilliseconds); // 5 minutes
        })
        .catch((err) => {
          console.error(err);
        });
      return () => clearInterval(liveInterval);
    }, []),
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: colors.DARK },
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
      initialRouteName={'OnGoingLives'}>
      <Tab.Screen
        options={{ title: 'LIVE EN COURS' }}
        name="OnGoingLives"
        component={OnGoingLive}
      />
      <Tab.Screen
        options={{ title: 'PROCHAINS LIVES' }}
        name="SellerUpcomingLives"
        component={ComingSoonLives}
      />
      <Tab.Screen options={{ title: 'LIVES TERMINÉS' }} name="EndedLives" component={EndedLives} />
      {/*DO NOT REMOVE : Hiding auction videos feature for now.*/}
      {/*<Tab.Screen*/}
      {/*  options={{ title: 'VIDÉOS ENCHÈRE' }}*/}
      {/*  name="AuctionVideos"*/}
      {/*  component={SellerAuctionVideos}*/}
      {/*/>*/}
    </Tab.Navigator>
  );
};

export default SellerLiveTab;
