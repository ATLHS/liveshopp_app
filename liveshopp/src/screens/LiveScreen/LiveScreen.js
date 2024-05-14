import React, {useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Pressable,
    TouchableOpacity,
    Modal,
    ActionSheetIOS,
    Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
    createAgoraRtcEngine,
    IRtcEngine,
    RtcSurfaceView,
} from 'react-native-agora';
import socket from '../../services/config/clientSocketIoConfig';
import SellerLiveForm from '../../components/SellerLiveForm/SellerLiveForm';
import LiveAuctionInfo from '../../components/LiveAuctionInfo/LiveAuctionInfo';
import UserLiveForm from '../../components/UserLiveForm/UserLiveForm';
import Toast from 'react-native-toast-message';
import colors from '../../styles/colors';
import {LiveChatTextInput} from '../../components/LiveChatTextInput/LiveChatTextInput';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faArrowDown,
    faArrowsRotate,
    faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import customer from '../../services/customer';
import admin from '../../services/admin';
import {DateTime} from 'luxon';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet from 'react-native-simple-bottom-sheet';
import LiveChatMessagesList from '../../components/LiveChatMessagesList/LiveChatMessagesList';
import {RadialGradient, LinearGradient} from 'react-native-gradients';

const colorList = [
    {offset: '20%', color: 'transparent', opacity: '0'},
    {offset: '0%', color: 'black', opacity: '0.6'},
    {offset: '90%', color: 'transparent', opacity: '0'},
    {offset: '100%', color: 'black', opacity: '0.6'},
];
export const LiveScreen = () => {
    const agoraEngineRef = IRtcEngine;
    const {isJoin, isHost, liveData, remoteUid} = useSelector(
        state => state.lives,
    );
    const {user} = useSelector(state => state.user);
    const [modalVisible, setModalVisible] = useState(false);
    const list = useRef(null);
    const panelRef = useRef(null);

    const renderUserLiveForm = () => {
        if (user.profil !== 'admin' && user.profil !== 'seller') {
            return (
                <UserLiveForm
                    liveData={liveData}
                    onPress={data =>
                        bidOnCurrentAuction(liveData.channelName, data)
                    }
                />
            );
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            agoraEngineRef.current = createAgoraRtcEngine();
            if (liveData.currentAuction.currentAuctionStatus === 'stopping') {
                showCurrentLiveNotificationToast();
            }

            if (!isHost) {
                if (!user.hasValidPaymentMethod || !user.shipping_address) {
                    setModalVisible(true);
                }
            }
        }, [liveData.currentAuction.currentAuctionStatus, user]),
    );

    useFocusEffect(
        React.useCallback(() => {
            liveData.messages.length && list.current.scrollToEnd();
        }, [liveData.messages]),
    );

    const startCurrentAuction = (channelName, data) => {
        socket.emit('startCurrentAuction', {channelName, data});
    };

    const switchCamera = () => {
        agoraEngineRef.current?.switchCamera();
    };

    const showCurrentLiveNotificationToast = () => {
        // if user win we must have a userid
        if (liveData.currentAuction.userId) {
            Toast.show({
                type: 'auctionToast',
                text1: `ADJUGÉE, VENDUE À ${liveData.currentAuction.username.toUpperCase()} 🎉`,
                topOffset: 100,
            });
        }
        if (!liveData.currentAuction.userId) {
            Toast.show({
                type: 'auctionToast',
                text1: 'ENCHÈRES TERMINÉES',
                topOffset: 100,
            });
        }
        socket.emit('pausedCurrentAuctionStatut', liveData.channelName);
    };
    const bidOnCurrentAuction = (channelName, data) => {
        data.username = user.firstname;
        data.userId = user.id;
        data.shipping_address = user.shipping_address;
        // send current bid info
        socket.emit('bid', {channelName, data});
    };

    const emitNewLiveMessage = (message, liveData) => {
        socket.emit('newLiveMessage', {user, message, liveData});
    };

    const showObjectionableAction = item => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: [
                    'Annuler',
                    'Bloquer cet utilisateur',
                    'Signaler cet utilisateur',
                ],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'light',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    return;
                } else if (buttonIndex === 1) {
                    ActionSheetIOS.showActionSheetWithOptions(
                        {
                            options: ['Annuler', 'Bloquer cet utilisateur'],
                            destructiveButtonIndex: 1,
                            cancelButtonIndex: 0,
                            userInterfaceStyle: 'light',
                            title: 'Vous ne verrez plus les messages et les lives de cet de utilisateur',
                        },
                        buttonIndex => {
                            if (buttonIndex === 0) {
                                return;
                            } else if (buttonIndex === 1) {
                                // block user
                                socket.emit('blockCustomer', {
                                    user,
                                    userId: item.userId,
                                    profil: item.profil,
                                });
                            }
                        },
                    );
                } else if (buttonIndex === 2) {
                    // signal user
                    ActionSheetIOS.showActionSheetWithOptions(
                        {
                            options: ['Annuler', 'Signaler cet utilisateur'],
                            destructiveButtonIndex: 1,
                            cancelButtonIndex: 0,
                            userInterfaceStyle: 'light',
                            title: 'Tout comportement ne respectant pas les conditions générales sera sanctionné',
                        },
                        buttonIndex => {
                            if (buttonIndex === 0) {
                                return;
                            } else if (buttonIndex === 1) {
                                // block user
                                customer
                                    .signalCustomer({
                                        item,
                                        flag_type: 'message',
                                        liveData,
                                    })
                                    .then(res => res)
                                    .then(data => {
                                        Alert.alert('', data.message, [
                                            {text: 'OK'},
                                        ]);
                                    })
                                    .catch(err => {
                                        Alert.alert('', err.message, [
                                            {text: 'OK'},
                                        ]);
                                    });
                            }
                        },
                    );
                }
            },
        );
    };

    const showObjectionableAdminAction = data => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Annuler', 'Bannir cet utilisateur'],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'light',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    return;
                } else if (buttonIndex === 1) {
                    admin
                        .banUser(data)
                        .then(res => res)
                        .then(data => {
                            Alert.alert('', data.message, [{text: 'OK'}]);
                        })
                        .catch(err => {
                            Alert.alert('', err.message, [{text: 'OK'}]);
                        });
                }
            },
        );
    };

    return (
        <View
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}>
            {isJoin && liveData.hostIsLive ? (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        {user.profil !== 'admin' && (
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible}>
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.60)',
                                    }}>
                                    <View
                                        style={{
                                            height: 230,
                                            width: 290,
                                            borderRadius: 5,
                                            backgroundColor: colors.LIGHT,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 30,
                                        }}>
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%',
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    fontFamily:
                                                        'Roboto-Regular',
                                                    marginBottom: 20,
                                                }}>
                                                Hey, bienvenue dans le game !{' '}
                                                {'\n\n'} Pour commencer à
                                                enchérir, n'oublie pas de
                                                renseigner un moyen de paiement
                                                et une adresse de livraison. 😉
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                            }}>
                                            <View
                                                style={{
                                                    borderRadius: 10,
                                                    height: 50,
                                                }}>
                                                <TouchableOpacity
                                                    style={{
                                                        height: 40,
                                                        width: 150,
                                                        backgroundColor:
                                                            'black',
                                                        borderRadius: 5,
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={() =>
                                                        setModalVisible(
                                                            !modalVisible,
                                                        )
                                                    }>
                                                    <Text
                                                        style={{
                                                            color: colors.LIGHT,
                                                            textAlign: 'center',
                                                            fontSize: 15,
                                                        }}>
                                                        J'ai compris
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </Modal>
                        )}
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                                height: Dimensions.get('window').height,
                                width: Dimensions.get('window').width,
                            }}>
                            <LinearGradient colorList={colorList} angle={90} />
                        </View>
                        <RtcSurfaceView
                            canvas={{uid: isHost ? 0 : remoteUid}}
                            style={styles.videoView}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 25,
                                width: '90%',
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 2,
                            }}>
                            <LiveChatMessagesList
                                list={list}
                                liveData={liveData}
                                user={user}
                                showObjectionableAction={
                                    showObjectionableAction
                                }
                                showObjectionableAdminAction={
                                    showObjectionableAdminAction
                                }
                            />

                            {liveData.currentAuction.currentAuctionStatus ===
                            'running' ? (
                                <>
                                    <LiveAuctionInfo />
                                    {renderUserLiveForm()}
                                </>
                            ) : isHost && user.profil === 'seller' ? (
                                <SellerLiveForm
                                    onPress={data =>
                                        startCurrentAuction(
                                            liveData.channelName,
                                            data,
                                        )
                                    }
                                    currentAuctionIsRunning={
                                        liveData.currentAuction
                                            .currentAuctionStatus === 'running'
                                    }
                                    panelRef={panelRef}
                                />
                            ) : (
                                <>
                                    <LiveChatTextInput
                                        onPress={(message, liveData) =>
                                            emitNewLiveMessage(
                                                message,
                                                liveData,
                                            )
                                        }
                                        live={liveData}
                                        isHost={isHost}
                                    />
                                </>
                            )}
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: 2,
                                width: 50,
                                backgroundColor: 'transparent',
                                height: 50,
                                top: 100,
                                right: 5,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}>
                            {user.profil === 'seller' && (
                                <TouchableOpacity
                                    onPress={() => switchCamera()}>
                                    <FontAwesomeIcon
                                        icon={faArrowsRotate}
                                        color={colors.LIGHT}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.containerr}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View style={styles.waitingLiveMessage}>
                            <Text style={styles.channelName}>
                                {liveData.channelName}
                            </Text>
                            <View style={styles.liveStatus}>
                                {liveData.auctionsStatus === 'coming_soon' ? (
                                    <>
                                        <View
                                            style={{
                                                marginBottom: 30,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <Text style={styles.liveSchedule}>
                                                {DateTime.fromISO(
                                                    liveData.liveSchedule,
                                                ).toLocaleString({
                                                    month: 'short',
                                                    day: 'numeric',
                                                    weekday: 'short',
                                                })}
                                                {' à '}
                                                {DateTime.fromISO(
                                                    liveData.liveSchedule,
                                                ).toLocaleString(
                                                    DateTime.TIME_SIMPLE,
                                                )}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                marginBottom: 30,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 200
                                            }}>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: colors.LIGHT,
                                                }}>
                                                En attendant, tu peux poser une
                                                question au vendeur.
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <FontAwesomeIcon
                                                icon={faArrowDown}
                                                size={25}
                                                color={colors.LIGHT}
                                            />
                                        </View>
                                    </>
                                ) : (
                                    <Text style={{color: colors.LIGHT}}>Le live devrait commencer d'ici peu !</Text>
                                )}
                            </View>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 25,
                                width: '90%',
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <LiveChatMessagesList
                                list={list}
                                liveData={liveData}
                                user={user}
                                showObjectionableAction={
                                    showObjectionableAction
                                }
                                showObjectionableAdminAction={
                                    showObjectionableAdminAction
                                }
                            />
                            <LiveChatTextInput
                                onPress={(message, liveData) =>
                                    emitNewLiveMessage(message, liveData)
                                }
                                live={liveData}
                                isHost={isHost}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    containerr: {
        flex: 1,
        backgroundColor: '#262626',
    },
    scroll: {flex: 1},
    scrollContainer: {flex: 1},
    videoView: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    waitingLiveMessage: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 100,
        marginHorizontal: 20,
    },
    channelName: {
        color: colors.LIGHT,
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    liveStatus: {
        color: colors.LIGHT,
        fontSize: 17,
        textAlign: 'center',
        padding: 20,
    },
    liveSchedule: {
        fontSize: 25,
        fontWeight: '600',
        color: colors.LIGHT,
    },
});

export default LiveScreen;
