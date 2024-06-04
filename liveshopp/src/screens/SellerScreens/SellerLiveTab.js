import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { setSellerLives } from '../../redux/slices/livesSlice';
import socket from '../../services/config/clientSocketIoConfig';
import colors from '../../styles/colors';
import ComingSoonLives from './ComingSoonLives';
import EndedLives from './EndedLives';
import OnGoingLive from './OnGoingLive';
import SellerAuctionVideos from './SellerAuctionVideos';

const Tab = createMaterialTopTabNavigator();

const SellerLiveTab = () => {
  const dispatch = useDispatch();
  const { sellerLives } = useSelector((state) => state.lives);

  useEffect(() => {}, [sellerLives]);
  socket.on('refreshingSellerLives', (sellerLives) => {
    dispatch(setSellerLives(sellerLives));
  });

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
