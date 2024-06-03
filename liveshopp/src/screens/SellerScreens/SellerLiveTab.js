import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { setIsHost } from '../../redux/slices/livesSlice';
import colors from '../../styles/colors';
import ComingSoonLives from './ComingSoonLives';
import EndedLives from './EndedLives';
import OnGoingLive from './OnGoingLive';
import SellerAuctionVideos from './SellerAuctionVideos';

const Tab = createMaterialTopTabNavigator();

const SellerLiveTab = () => {
  const dispatch = useDispatch();
  // Switch isHost to true in the SellerLiveTab only to set the ClientRoleType to ClientRoleBroadcaster when a seller join a live ( Used in LiveScreen.js L 126 )
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setIsHost(true));
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
      <Tab.Screen
        options={{ title: 'VIDÉOS ENCHÈRE' }}
        name="AuctionVideos"
        component={SellerAuctionVideos}
      />
    </Tab.Navigator>
  );
};

export default SellerLiveTab;
