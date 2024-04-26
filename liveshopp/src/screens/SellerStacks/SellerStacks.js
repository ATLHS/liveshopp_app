import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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
import {
    setIsHost,
    setSellerLives,
} from '../../redux/slices/livesSlice';
import seller from '../../services/seller';
import OrderTab from '../OrderTab/OrderTab';
import LivesTab from '../LivesTab/LivesTab';
import colors from '../../styles/colors';
import AutocompleteDropdownSearch from '../../components/AutocompleteDropdownSearch/AutocompleteDropdownSearch';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';

const Tab = createBottomTabNavigator();

export const SellerStacks = ({navigation}) => {
    const dispatch = useDispatch();

    const createNewLive = () => {
        navigation.navigate('SettingNewLive');
    };
    return (
        <AutocompleteDropdownContextProvider>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {backgroundColor: 'white'},
                    headerStyle: {backgroundColor: 'white'},
                    headerTitleStyle: {
                        color: 'black',
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
                                size={styles.tabBarIconSize.fontSize}
                                color={styles.tabBarIconColor.color}
                            />
                        ),
                        header: () => (
                            <View style={styles.headerContainer}>
                                <AutocompleteDropdownSearch
                                    navigation={navigation}
                                />
                            </View>
                        ),
                    }}
                    name="Lives"
                    component={LivesTab}
                />
                <Tab.Screen
                    options={{
                        title: 'MES LIVES',
                        tabBarIcon: ({color, size}) => (
                            <FontAwesomeIcon
                                icon={faTowerBroadcast}
                                size={styles.tabBarIconSize.fontSize}
                                color={styles.tabBarIconColor.color}
                            />
                        ),
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={createNewLive}
                                style={{marginRight: 15}}>
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    size={25}
                                    color={'black'}
                                />
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
                            <FontAwesomeIcon
                                icon={faBoxOpen}
                                size={styles.tabBarIconSize.fontSize}
                                color={styles.tabBarIconColor.color}
                            />
                        ),
                    }}
                    name="Order"
                    component={OrderTab}
                />

                <Tab.Screen
                    options={{
                        title: 'MON PROFIL',
                        tabBarIcon: ({color, size}) => (
                            <FontAwesomeIcon
                                icon={faUser}
                                size={styles.tabBarIconSize.fontSize}
                                color={styles.tabBarIconColor.color}
                            />
                        ),
                    }}
                    name="Settings"
                    component={SettingsScreen}
                />
            </Tab.Navigator>
        </AutocompleteDropdownContextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBarIconColor: {
        color: colors.DARK,
    },
    tabBarIconSize: {
        fontSize: 20,
    },
    headerContainer: {
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 100,
    },
});

export default SellerStacks;
