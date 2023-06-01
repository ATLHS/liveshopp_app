import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../../styles/colors';
import ComingLives from '../ComingLives/ComingLives';
import LivesScreen from "../LivesScreen/LivesScreen";
import {setIsHost, setLives} from "../../redux/slices/livesSlice";
import live from "../../services/live";
import {useDispatch} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";
import customer from "../../services/customer";
import {setBlockedUser} from "../../redux/slices/userSlice";

const Tab = createMaterialTopTabNavigator();

const LivesTab = () => {
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            dispatch(setIsHost(false));
            customer
                .getBlockedUser()
                .then(res => res)
                .then(data => {
                    const sellerIds = data.blockedSeller.map(seller => seller._id);
                    const userIds = data.blockedUser.map(user => user._id);

                    dispatch(setBlockedUser({blockedUser: userIds, blockedSeller: sellerIds}));
                })
                .catch(err => {
                    console.log(err);
                });
        }, []),
    );

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {backgroundColor: colors.DARK},
            }}>
            <Tab.Screen
                options={{
                    title: 'EN COURS',
                }}
                name="LivesScreen"
                component={LivesScreen}
            />
            <Tab.Screen
                options={{title: 'À VENIR'}}
                name="Processing"
                component={ComingLives}
            />
        </Tab.Navigator>
    );
};

export default LivesTab;
