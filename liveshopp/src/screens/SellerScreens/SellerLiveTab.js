import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { setSellerLives } from '../../redux/slices/livesSlice';
import seller from '../../services/seller';
import colors from '../../styles/colors';
import ComingSoonLives from './ComingSoonLives';
import EndedLives from './EndedLives';
import OnGoingLive from './OnGoingLive';
import SellerAuctionVideos from './SellerAuctionVideos';

const Tab = createMaterialTopTabNavigator();

const SellerLiveTab = () => {
  const dispatch = useDispatch();
  const { sellerLives } = useSelector((state) => state.lives);

  useFocusEffect(
    React.useCallback(() => {
      seller
        .getSellerLives()
        .then((res) => res)
        .then((data) => {
          dispatch(setSellerLives(data.sellerLives));
        })
        .catch((err) => {
          console.error(err, 'get lives error.');
        });
    }, [sellerLives.length]),
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
      <Tab.Screen
        options={{ title: 'VIDÉOS ENCHÈRE' }}
        name="AuctionVideos"
        component={SellerAuctionVideos}
      />
    </Tab.Navigator>
  );
};

export default SellerLiveTab;
