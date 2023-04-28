import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import OnGoingLive from './OnGoingLive';
import ComingSoonLives from './ComingSoonLives';
import EndedLives from './EndedLives';
import colors from '../../styles/colors';

const Tab = createMaterialTopTabNavigator();

const SellerLiveTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor: colors.DARK},
      }}
      initialRouteName={'OnGoingLives'}>
      <Tab.Screen
        options={{title: 'En cours'}}
        name="OnGoingLives"
        component={OnGoingLive}
      />
      <Tab.Screen
        options={{title: 'À venir'}}
        name="ComingSoonLives"
        component={ComingSoonLives}
      />
      <Tab.Screen
        options={{title: 'Terminés'}}
        name="EndedLives"
        component={EndedLives}
      />
    </Tab.Navigator>
  );
};

export default SellerLiveTab;
