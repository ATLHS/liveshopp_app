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
    AppState,
    FlatList, ActionSheetIOS, Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {RtcSurfaceView} from 'react-native-agora';
import socket from '../../services/config/clientSocketIoConfig';
import SellerLiveForm from '../../components/SellerLiveForm/SellerLiveForm';
import LiveAuctionInfo from '../../components/LiveAuctionInfo/LiveAuctionInfo';
import UserLiveForm from '../../components/UserLiveForm/UserLiveForm';
import Toast from 'react-native-toast-message';
import colors from '../../styles/colors';
import {LiveChatTextInput} from '../../components/LiveChatTextInput/LiveChatTextInput';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";
import customer from "../../services/customer";
import admin from "../../services/admin";

export const LiveScreen = () => {
    const {isJoin, isHost, liveData, remoteUid} = useSelector(
        state => state.lives,
    );
    const {user} = useSelector(state => state.user);
    const [modalVisible, setModalVisible] = useState(false);
    const list = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
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
            // if the user closes the application while the live screen is open, he is removed from the room.
            AppState.addEventListener('change', nextAppState => {
                if (nextAppState === 'background' && liveData.channelName) {
                    socket.emit('leaveRoom', {liveData, user});
                }
            });
        }, [liveData.channelName]),
    );

    useFocusEffect(
        React.useCallback(() => {
            liveData.messages.length && list.current.scrollToEnd();
        }, [liveData.messages]),
    );

    const startCurrentAuction = (channelName, data) => {
        socket.emit('startCurrentAuction', {channelName, data});
    };

    const showCurrentLiveNotificationToast = () => {
        // if user win we must have a userid
        if (liveData.currentAuction.userId) {
            Toast.show({
                type: 'auctionToast',
                text1: `ADJUGÉ, VENDUE À ${liveData.currentAuction.username.toUpperCase()}`,
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

    const showObjectionableAction = (item) => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Annuler', 'Bloquer cet utilisateur', 'Signaler cet utilisateur'],
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
                            title: 'Vous ne verrez plus les messages et les lives de cet de utilisateur'
                        },
                        buttonIndex => {
                            if (buttonIndex === 0) {
                                return;
                            } else if (buttonIndex === 1) {
                                // block user
                                socket.emit('blockCustomer', {user, userId: item.userId, profil: item.profil});
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
                            title: 'Tout comportement ne respectant pas les conditions générales sera sanctionné'
                        },
                        buttonIndex => {
                            if (buttonIndex === 0) {
                                return;
                            } else if (buttonIndex === 1) {
                                // block user
                                customer
                                    .signalCustomer({item, flag_type: 'message', liveData})
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
    }

    const showObjectionableAdminAction = (data) => {
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

    return (
        <View style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
            {isJoin && liveData.hostIsLive ? (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <View style={{flex: 1, alignItems: 'center'}}>
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
                                                fontFamily: 'Roboto-Regular',
                                                marginBottom: 20,
                                            }}>
                                            Hey, bienvenue dans le game ! {'\n\n'} Pour commencer à
                                            enchérir, n'oublie pas de renseigner un moyen de paiement
                                            et une adresse de livraison. 😉
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}>
                                        <View style={{borderRadius: 10, height: 50}}>
                                            <TouchableOpacity
                                                style={{
                                                    height: 40,
                                                    width: 150,
                                                    backgroundColor: 'black',
                                                    borderRadius: 5,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => setModalVisible(!modalVisible)}>
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
                            }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                contentInset={{top: 0, bottom: 40, left: 0, right: 0}}
                                ref={list}
                                style={{
                                    height: 150,
                                    width: 325,
                                    marginBottom: 15,
                                    backgroundColor: 'transparent',
                                }}
                                data={liveData.messages}
                                renderItem={({item}) => (
                                    !user.blockedUser.concat(user.blockedSeller).includes(item.userId) &&
                                    <View style={{marginBottom: 7, marginTop: 7}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text
                                                style={{
                                                    color: colors.LIGHT,
                                                    fontSize: 13,
                                                    fontWeight: '700',
                                                    marginBottom: 3,
                                                }}>
                                                {item.username}
                                            </Text>
                                            {user.id !== item.userId &&
                                                <TouchableOpacity onPress={() => user.profil === 'admin' ? showObjectionableAdminAction({item, liveData}) : showObjectionableAction(item)}>
                                                    <FontAwesomeIcon
                                                        icon={faEllipsis}
                                                        color={colors.LIGHT}
                                                        size={20}

                                                    />
                                                </TouchableOpacity>}
                                        </View>
                                        <Text style={{color: colors.LIGHT, fontSize: 14}}>
                                            {item.message}
                                        </Text>
                                    </View>
                                )}
                                keyExtractor={item => item.id}
                            />
                            {isHost && user.profil === 'seller' ? (
                                liveData.currentAuction.currentAuctionStatus === 'running' ? (
                                    <LiveAuctionInfo/>
                                ) : (
                                    <SellerLiveForm
                                        onPress={data =>
                                            startCurrentAuction(liveData.channelName, data)
                                        }
                                    />
                                )
                            ) : (
                                <>
                                    {liveData.currentAuction.currentAuctionStatus ===
                                        'running' && <LiveAuctionInfo/>}
                                    <UserLiveForm
                                        liveData={liveData}
                                        onPress={data =>
                                            bidOnCurrentAuction(liveData.channelName, data)
                                        }
                                    />
                                    <LiveChatTextInput
                                        onPress={(message, liveData) =>
                                            emitNewLiveMessage(message, liveData)
                                        }
                                        live={liveData}
                                        isHost={isHost}
                                    />
                                </>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.containerr}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}>
                            <View style={{marginTop: 100}}>
                                <Text
                                    style={{
                                        color: colors.LIGHT,
                                        fontSize: 25,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                    }}>
                                    {liveData.channelName}
                                </Text>
                            </View>
                            <View style={{margin: 5, width: 350}}>
                                <Text
                                    style={{
                                        color: colors.LIGHT,
                                        fontSize: 17,
                                        textAlign: 'center',
                                        padding: 20,
                                    }}>
                                    Le live devrait commencer d'ici peu, mets-toi à l'aise, 🍿 ça va
                                    être le 🔥!
                                </Text>
                            </View>
                            {/*<View style={{margin: 20}}>
                <ActivityIndicator size="large" color={colors.LIGHT} />
              </View>*/}
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 25,
                                width: '90%',
                                marginLeft: 20,
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                marginBottom: 20,
                            }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                contentInset={{top: 0, bottom: 50, left: 0, right: 0}}
                                ref={list}
                                style={{
                                    height: 200,
                                    width: 320,
                                    marginLeft: 15,
                                    marginBottom: 15,
                                }}
                                data={liveData.messages}
                                renderItem={({item}) => (
                                    !user.blockedUser.concat(user.blockedSeller).includes(item.userId) &&
                                    <View style={{marginBottom: 7, marginTop: 7}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                <Text
                                                    style={{
                                                        color: colors.LIGHT,
                                                        fontSize: 13,
                                                        fontWeight: '700',
                                                        marginBottom: 3,
                                                        marginRight: 5
                                                    }}>
                                                    {item.username}
                                                </Text>
                                                {item.profil === 'admin' && <View style={{backgroundColor: colors.LIGHT, color: colors.DARK, borderRadius: 2, alignItems: 'center', marginBottom: 3, padding: 2, paddingRight: 4, paddingLeft: 4}}><Text style={{color: colors.DARK, fontWeight: '700', fontSize: 10}}>Admin</Text></View>}
                                            </View>
                                            {user.id !== item.userId && item.profil !== 'admin' &&
                                                <TouchableOpacity onPress={() => user.profil === 'admin' ? showObjectionableAdminAction({item, liveData}) : showObjectionableAction(item)}>
                                                    <FontAwesomeIcon
                                                        icon={faEllipsis}
                                                        color={colors.LIGHT}
                                                        size={20}

                                                    />
                                                </TouchableOpacity>}
                                        </View>
                                        <Text style={{color: colors.LIGHT, fontSize: 14}}>
                                            {item.message}
                                        </Text>
                                    </View>
                                )}
                                keyExtractor={item => item.id}
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
});

export default LiveScreen;
