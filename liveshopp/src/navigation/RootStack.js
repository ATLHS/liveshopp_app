import {NavigationContainer} from '@react-navigation/native';
import UserStack from './UserStack';
import SellerStack from './SellerStack';
import AuthStack from './AuthStach';
import Loading from '../screens/Loading/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import socket from '../services/config/clientSocketIoConfig';
import {setLiveData} from '../redux/slices/livesSlice';
import axiosConfig from '../services/config/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setNewUserToBlock} from "../redux/slices/userSlice";

const RootStack = ({isLoading}) => {
    const {user} = useSelector(state => state.user);
    const isAuthenticate = useSelector(state => state.user.isAuthenticate);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticate) {
            AsyncStorage.getItem('@token').then(token => {
                axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
            });
            socket.on('connect', () => {
                console.log(socket.id, 'web socket connected');
            });
            socket.on('hasBeenBlocked', blockedInfo => {
                dispatch(setNewUserToBlock(blockedInfo));
            });
            socket.on('channelData', channelData => {
                dispatch(setLiveData(channelData));
            });
            socket.on('currentAuctionData', async channelData => {
                try {
                    dispatch(setLiveData(channelData));
                } catch (e) {
                    console.log(e);
                }
            });
        }
    }, [socket, isAuthenticate]);

    return (
        <NavigationContainer>
            {isLoading ? (
                <Loading/>
            ) : !isAuthenticate ? (
                <AuthStack/>
            ) : user.profil === 'seller' ? (
                <SellerStack/>
            ) : (
                <UserStack/>
            )}
        </NavigationContainer>
    );
};

export default RootStack;
