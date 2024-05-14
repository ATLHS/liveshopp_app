import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import OnGoingLive from './OnGoingLive';
import ComingSoonLives from './ComingSoonLives';
import EndedLives from './EndedLives';
import colors from '../../styles/colors';
import SellerAuctionVideos from "./SellerAuctionVideos";

const Tab = createMaterialTopTabNavigator();

const SellerLiveTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {backgroundColor: colors.DARK},
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {
                    fontSize: 11,
                },
            }}
            initialRouteName={'OnGoingLives'}>
            <Tab.Screen
                options={{title: 'LIVE EN COURS'}}
                name="OnGoingLives"
                component={OnGoingLive}
            />
            <Tab.Screen
                options={{title: 'PROCHAINS LIVES'}}
                name="SellerUpcomingLives"
                component={ComingSoonLives}
            />
            <Tab.Screen
                options={{title: 'LIVES TERMINÉS'}}
                name="EndedLives"
                component={EndedLives}
            />
            <Tab.Screen
                options={{title: 'VIDÉOS ENCHÈRE'}}
                name="AuctionVideos"
                component={SellerAuctionVideos}
            />
        </Tab.Navigator>
    );
};

export default SellerLiveTab;
