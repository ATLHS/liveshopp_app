import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faTowerBroadcast,
    faHome,
    faPlus,
    faUser,
    faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsScreen from '../SettingsScreen/SettingsScreen';
import SellerLiveTab from '../SellerScreens/SellerLiveTab';
import {useDispatch} from 'react-redux';
import LivesScreen from '../LivesScreen/LivesScreen';
import {
    setIsHost, setLives,
    setSellerLives,
} from '../../redux/slices/livesSlice';
import seller from '../../services/seller';
import OrderTab from '../OrderTab/OrderTab';
import {useFocusEffect} from "@react-navigation/native";
import live from "../../services/live";

const Tab = createBottomTabNavigator();

export const SellerStacks = ({navigation}) => {
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            live
                .getLives()
                .then(res => res)
                .then(data => {
                    dispatch(setLives(data.lives));
                })
                .catch(err => {
                    console.log(err, 'get lives error.');
                });
        }, []),
    );

    const createNewLive = () => {
        navigation.navigate('SettingNewLive');
    };
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {backgroundColor: 'black'},
                headerStyle: {backgroundColor: 'black'},
                headerTitleStyle: {color: 'white', fontFamily: 'FugazOne-Regular'},
                tabBarShowLabel: false,
            }}>
            <Tab.Screen
                options={{
                    title: 'LIVES',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesomeIcon icon={faHome} size={20} color={'white'}/>
                    ),
                }}
                name="LivesScreen"
                component={LivesScreen}
            />

            <Tab.Screen
                options={{
                    title: 'MES LIVES',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesomeIcon
                            icon={faTowerBroadcast}
                            size={20}
                            color={'white'}
                        />
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={createNewLive} style={{marginRight: 15}}>
                            <FontAwesomeIcon icon={faPlus} size={25} color={'white'}/>
                        </TouchableOpacity>
                    ),
                }}
                name="SellerLives"
                component={SellerLiveTab}
                listeners={{
                    tabPress: e => {
                        dispatch(setIsHost(true));
                        seller
                            .getSellerLives()
                            .then(res => res)
                            .then(data => {
                                dispatch(setSellerLives(data.lives));
                            })
                            .catch(err => {
                                console.log(err, 'get lives error.');
                            });
                    },
                }}
            />

            <Tab.Screen
                options={{
                    title: 'MES COMMANDES',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesomeIcon icon={faBoxOpen} size={20} color={'white'}/>
                    ),
                }}
                name="Order"
                component={OrderTab}
            />

            <Tab.Screen
                options={{
                    title: 'MON PROFIL',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesomeIcon icon={faUser} size={20} color={'white'}/>
                    ),
                }}
                name="Settings"
                component={SettingsScreen}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SellerStacks;
