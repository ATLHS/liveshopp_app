import React from 'react';
import {StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome, faUser, faBoxOpen} from '@fortawesome/free-solid-svg-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsScreen from '../SettingsScreen/SettingsScreen';
import OrderTab from '../OrderTab/OrderTab';
import LivesTab from "../LivesTab/LivesTab";

const Tab = createBottomTabNavigator();

export const UserStacks = () => {
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
                name="Lives"
                component={LivesTab}
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
    profilHeadline: {marginBottom: 30},
    container: {
        flex: 1,
    },
});

export default UserStacks;
