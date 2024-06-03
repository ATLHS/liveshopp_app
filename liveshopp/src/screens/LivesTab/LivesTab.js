import React from 'react';
import { useDispatch } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { setBlockedUser } from '../../redux/slices/userSlice';
import customer from '../../services/customer';
import colors from '../../styles/colors';
import AuctionVideos from '../AuctionVideos/AuctionVideos';
import ComingLives from '../ComingLives/ComingLives';
import LivesScreen from '../LivesScreen/LivesScreen';

const Tab = createMaterialTopTabNavigator();

const LivesTab = () => {
  const dispatch = useDispatch();

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
          title: 'LIVE ENCHÈRE',
        }}
        name="LivesScreen"
        component={LivesScreen}
      />
      <Tab.Screen
        options={{
          title: 'VIDÉOS ENCHÈRE',
          swipeEnabled: false,
        }}
        name="AuctionVideos"
        component={AuctionVideos}
      />
      <Tab.Screen
        options={{ title: 'PROCHAINEMENT' }}
        name="UpcomingLives"
        component={ComingLives}
      />
    </Tab.Navigator>
  );
};

export default LivesTab;
