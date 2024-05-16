import React from 'react';
import {StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome, faUser} from '@fortawesome/free-solid-svg-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsScreen from '../SettingsScreen/SettingsScreen';
import LivesTab from '../LivesTab/LivesTab';

const Tab = createBottomTabNavigator();

export const AdminStacks = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {backgroundColor: 'black'},
                headerStyle: {backgroundColor: 'black'},
                headerTitleStyle: {
                    color: 'white',
                    fontFamily: 'FugazOne-Regular',
                },
                tabBarShowLabel: false,
            }}>
            <Tab.Screen
                options={{
                    title: 'LIVES',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesomeIcon
                            icon={faHome}
                            size={20}
                            color={'white'}
                        />
                    ),
                }}
                name="LivesScreen"
                component={LivesTab}
            />
            <Tab.Screen
                options={{
                    title: 'MON PROFIL',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesomeIcon
                            icon={faUser}
                            size={20}
                            color={'white'}
                        />
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

export default AdminStacks;
