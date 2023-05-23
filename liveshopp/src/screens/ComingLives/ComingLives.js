import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import colors from '../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
    setIsJoin,
    setIsGone, setIsHost, setLives,
} from '../../redux/slices/livesSlice';
import live from '../../services/live';
import socket from '../../services/config/clientSocketIoConfig';
import LiveCard from '../../components/liveCard/liveCard';
import {useFocusEffect} from '@react-navigation/native';
import NoData from '../../components/NoData/NoData';
import customer from "../../services/customer";
import {setBlockedUser} from "../../redux/slices/userSlice";

export const LivesScreen = ({navigation}) => {
    const {isGone, lives} = useSelector(
        state => state.lives,
    );
    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (isGone) {
                goOut();
            }
        }, [isGone]),
    );

    useFocusEffect(
        React.useCallback(() => {
            dispatch(setIsHost(false));
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

    useFocusEffect(
        React.useCallback(() => {
            customer
                .getBlockedUser()
                .then(res => res)
                .then(data => {
                    const sellerIds = data.blockedSeller.map(seller => seller._id);
                    const userIds = data.blockedUser.map(user => user._id);

                    dispatch(setBlockedUser({blockedUser: userIds, blockedSeller: sellerIds}));
                    setIsLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                });
        }, []),
    );

    const goLive = async liveData => {
        try {
            socket.emit('joinChannel', {liveData, user});
            dispatch(setIsJoin(false));
            navigation.navigate('LiveScreen');
        } catch (e) {
            console.log(e);
        }
    };

    const goOut = () => {
        try {
            dispatch(setIsGone(false));
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}
                    contentInset={{bottom: 100}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.onGoingLive}>
                            {!isLoading &&
                                lives &&
                                lives
                                    .filter(live => live.seller_id !== user.id && live.live_status === 'coming_soon' && !user.blockedUser.concat(user.blockedSeller).includes(live.seller_id))
                                    .map((live, id) => (
                                        <LiveCard
                                            key={id}
                                            sellerName={live.sellerName}
                                            datetime={live.live_date_time}
                                            description={live.live_description}
                                            category={live.business_activity}
                                            status={live.live_status}
                                            onPress={() => goLive(live)}
                                            imageUrl={live.imageUrl || ''}
                                        />
                                    ))}
                            {lives && !isLoading ? (
                                <View
                                    style={{
                                        width: 150,
                                        height: 230,
                                        margin: 10,
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            ) : !lives.length && !isLoading ? (
                                <NoData
                                    title={'Aucun lives à venir'}
                                    message={
                                        'Les lives à venir apparaitron ici.'
                                    }
                                    buttonTitle={''}
                                />
                            ) : (
                                <View style={{height: '100%', justifyContent: 'center'}}>
                                    <ActivityIndicator size="large" color="black"/>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    onGoingLive: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: 10
    },
    headlineContainer: {marginBottom: 30},
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headlineContainerMessage: {
        marginBottom: 30,
        width: 350,
        textAlign: 'center',
    },
    headlineMessage: {
        color: colors.DARK,
        fontFamily: 'FugazOne-Regular',
        fontSize: 30,
        textAlign: 'center',
    },
    fieldContainer: {margin: 10, marginBottom: 30},
    headline: {
        color: colors.LIGHT,
        fontFamily: 'Roboto-Regular',
        fontSize: 30,
        width: 350,
        textAlign: 'left',
    },
    action: {},
    resetPassword: {color: 'white'},
});

export default LivesScreen;
