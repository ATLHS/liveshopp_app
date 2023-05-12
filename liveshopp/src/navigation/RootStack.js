import {NavigationContainer} from '@react-navigation/native';
import UserStack from './UserStack';
import SellerStack from './SellerStack';
import AdminStack from './AdminStack';
import AuthStack from './AuthStach';
import Loading from '../screens/Loading/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import socket from '../services/config/clientSocketIoConfig';
import {setIsGone, setIsJoin, setLiveData} from '../redux/slices/livesSlice';
import axiosConfig from '../services/config/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setBlockedUser, setIsAuthenticate, setUser} from "../redux/slices/userSlice";
import Toast from "react-native-toast-message";

const RootStack = ({isLoading}) => {
    const {user} = useSelector(state => state.user);
    const isAuthenticate = useSelector(state => state.user.isAuthenticate);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('connect', () => {
            console.log(socket.id, 'web socket connected');
        });
        if (isAuthenticate) {
            AsyncStorage.getItem('@token').then(token => {
                axiosConfig.defaults.headers.Authorization = `Bearer ${token}`;
            });
        }
        socket.removeAllListeners();
    }, [isAuthenticate]);


    socket.on('banUser', async data => {
        if (data.updatedCustomer._id === user.id) {
            socket.emit('leaveRoom', {liveData: data.liveData.liveData, user: data.updatedCustomer});
            dispatch(setIsJoin(false));
            dispatch(setIsGone(true));
            Toast.hide();
            dispatch(
                setLiveData({
                    channelName: '',
                    sellerId: '',
                    auctionId: '',
                    auctionsStatus: '',
                    userCount: '',
                    messages: [],
                    currentAuction: {
                        userId: '',
                        username: '',
                        productName: false,
                        currentProductAmount: '',
                        currentAuctionDelay: '',
                        currentAuctionStatus: '',
                        salePrice: '',
                    },
                }),
            );
            await AsyncStorage.removeItem('@token');
            dispatch(setIsAuthenticate(false));
            dispatch(setUser({profil: null}));
        }
    });
    socket.on('hasBeenBlocked', blockedInfo => {
        dispatch(setBlockedUser(blockedInfo));
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

    return (
        <NavigationContainer>
            {isLoading ? (
                <Loading/>
            ) : !isAuthenticate ? (
                <AuthStack/>
            ) : user.profil === 'admin' ?
                <AdminStack/>
                : user.profil === 'seller' ? (
                    <SellerStack/>
                ) : (
                    <UserStack/>
                )}
        </NavigationContainer>
    );
};

export default RootStack;
