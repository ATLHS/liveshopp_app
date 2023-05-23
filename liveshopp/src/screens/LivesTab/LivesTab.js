import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../../styles/colors';
import ComingLives from '../ComingLives/ComingLives';
import LivesScreen from "../LivesScreen/LivesScreen";
import {setIsHost, setLives} from "../../redux/slices/livesSlice";
import live from "../../services/live";
import {useDispatch} from "react-redux";

const Tab = createMaterialTopTabNavigator();

const LivesTab = () => {
    const dispatch = useDispatch();

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
                listeners={{
                    tabPress: e => {
                        console.log("comming lives")
                        dispatch(setIsHost(false));
                        live
                            .getLives()
                            .then(res => res)
                            .then(data => {
                                console.log(data.lives, 'comming live')
                                dispatch(setLives(data.lives));
                            })
                            .catch(err => {
                                console.log(err, 'get lives error.');
                            });
                    }
                }}
            />
        </Tab.Navigator>
    );
};

export default LivesTab;
