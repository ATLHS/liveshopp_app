import React, { useRef, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-fixed';
import { trigger } from 'react-native-haptic-feedback';
import BottomSheet from 'react-native-simple-bottom-sheet';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';

import { DateTime } from 'luxon';

import { REACT_APP_STRIPE_PUBLIC_KEY } from '@env';
import { faAnglesRight, faEllipsis, faStore, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Slider } from '@miblanchard/react-native-slider';
import { useFocusEffect } from '@react-navigation/native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

import NoData from '../../components/NoData/NoData';
import { setSellersAuctionVideos } from '../../redux/slices/auctionsVideoSlice';
import { setBlockedUser, setUser } from '../../redux/slices/userSlice';
import admin from '../../services/admin';
import auctionVideoService from '../../services/auctionVideos';
import customerService from '../../services/customer';
import customer from '../../services/customer';
import stripe from '../../services/stripe';
import colors from '../../styles/colors';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const AuctionVideos = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [bidStartingPrice, setBidStartingPrice] = useState(null);
  const [readyToDisplay, setReadyToDisplay] = useState(false);
  const { sellersAuctionVideos } = useSelector((state) => state.auctionVideos);
  const { user } = useSelector((state) => state.user);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useDispatch();
  let player = useRef(null);
  const panelRef = useRef(null);

  const showReportAction = (item) => {
    const isCurrentUser = user.id === item.seller_id;
    return isCurrentUser;
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAuctionVideo();
    }, []),
  );

  const goSettingShippingAddress = () => {
    navigation.navigate('SettingShippingAddress');
  };

  const handleEndingAuction = (endingAuctionId) => {
    setIsLoading(true);
    auctionVideoService
      .handleEndingAuction({ endingAuctionId })
      .then((res) => res)
      .then((data) => {
        dispatch(
          setSellersAuctionVideos(
            data.auctionVideos.filter(
              (auctionVideo) =>
                !user.blockedUser.concat(user.blockedSeller).includes(auctionVideo.seller_id),
            ),
          ),
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const fetchPaymentSheetParams = async () => {
    return await stripe
      .fetchPaymentSheet()
      .then((res) => res)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const initializePaymentSheet = async () => {
    const { setupIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Liveshopp',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
    });

    if (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    let buttonText = '';
    let onPressAction = null;

    if (!user.hasValidPaymentMethod && user.shipping_address) {
      buttonText = 'Ajouter un moyen de paiement';
      onPressAction = openPaymentSheet;
    } else if (user.hasValidPaymentMethod && !user.shipping_address) {
      buttonText = 'Ajouter une adresse de livraison';
      onPressAction = goSettingShippingAddress;
    } else if (!user.hasValidPaymentMethod && !user.shipping_address) {
      buttonText = 'Ajouter un moyen de paiement';
      onPressAction = openPaymentSheet;
    }

    return (
      <TouchableOpacity disabled={isLoading} style={styles.touchableStyle} onPress={onPressAction}>
        {!isLoading ? (
          <Text style={styles.title}>{buttonText}</Text>
        ) : (
          <ActivityIndicator size="small" color={colors.DARK} />
        )}
      </TouchableOpacity>
    );
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error(error.message);
    } else {
      customerService
        .updateCustomerPaymentMethodStatut()
        .then((res) => res)
        .then((data) => {
          dispatch(setUser(data.user));
          Toast.show({
            type: 'success',
            text1: data.message,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const differenceInSeconds = (enDate) => {
    const now = DateTime.now();
    const dateCible = DateTime.fromISO(enDate);

    return dateCible.diff(now, 'seconds').toObject().seconds;
  };

  useFocusEffect(
    React.useCallback(() => {
      initializePaymentSheet();
    }, []),
  );

  const processNewBid = (selectedOffer, bidStartingPrice) => {
    const offer = { selectedOffer, bid_offer: bidStartingPrice, user };
    setIsLoading(true);
    auctionVideoService
      .processNewBid(offer)
      .then((res) => res)
      .then((data) => {
        dispatch(
          setSellersAuctionVideos(
            data.auctionVideos.filter(
              (auctionVideo) =>
                auctionVideo.auctionStatus === 'onGoing' &&
                !user.blockedUser.concat(user.blockedSeller).includes(auctionVideo.seller_id),
            ),
          ),
        );
        setIsLoading(false);
        navigation.navigate('BidConfirmationScreen', {
          selectedOfferParams: selectedOffer,
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const fetchAuctionVideo = () => {
    setIsLoading(true);

    // TO FIX : After clicking 'Bloquer cet utilisateur' via the showObjectionableAction function, the fetchAuctionVideo
    // function is called back and must filter all auction videos from sellers who are not blocked by the current
    // user and update the Redux store. The IDs of blocked users are stored in two arrays, blockedSeller [] and blockedUser [].
    auctionVideoService
      .getSellersAuctionVideo()
      .then((res) => res)
      .then((data) => {
        dispatch(
          setSellersAuctionVideos(
            data.auctionVideos.filter(
              (auctionVideo) =>
                !user.blockedUser.concat(user.blockedSeller).includes(auctionVideo.seller_id) ||
                !user.blockedUser
                  .concat(user.blockedSeller)
                  .map((b) => b._id)
                  .includes(auctionVideo.seller_id),
            ),
          ),
        );

        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const showObjectionableAction = (item) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Annuler', 'Bloquer cet utilisateur', 'Signaler cet utilisateur'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          return;
        } else if (buttonIndex === 1) {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Annuler', 'Bloquer cet utilisateur'],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 0,
              userInterfaceStyle: 'light',
              title: 'Vous ne verrez plus aucun contenu de cet utilisateur',
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                return;
              } else if (buttonIndex === 1) {
                // block user
                customer
                  .blockUser({
                    item,
                    profil: 'seller',
                  })
                  .then((res) => res)
                  .then((data) => {
                    Alert.alert('', data.message, [{ text: 'OK' }]);

                    dispatch(
                      setBlockedUser({
                        blockedSeller: data.user.blockedSeller,
                        blockedUser: data.user.blockedUser,
                      }),
                    );

                    fetchAuctionVideo();
                  })
                  .catch((err) => {
                    console.error(err, 'error');
                    Alert.alert('', err.message, [{ text: 'OK' }]);
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
            (buttonIndex) => {
              if (buttonIndex === 0) {
                return;
              } else if (buttonIndex === 1) {
                // block user
                customer
                  .signalAuctionVideo({
                    item,
                  })
                  .then((res) => res)
                  .then((data) => {
                    Alert.alert('', data.message, [{ text: 'OK' }]);
                  })
                  .catch((err) => {
                    Alert.alert('', err.message, [{ text: 'OK' }]);
                  });
              }
            },
          );
        }
      },
    );
  };

  const showObjectionableAdminAction = (data) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Annuler', 'Bannir cet utilisateur'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          return;
        } else if (buttonIndex === 1) {
          admin
            .banUser(data)
            .then((res) => res)
            .then((data) => {
              Alert.alert('', data.message, [{ text: 'OK' }]);
            })
            .catch((err) => {
              Alert.alert('', err.message, [{ text: 'OK' }]);
            });
        }
      },
    );
  };

  return (
    <StripeProvider publishableKey={REACT_APP_STRIPE_PUBLIC_KEY}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          {!isLoading && sellersAuctionVideos.length ? (
            <>
              <FlatList
                contentContainerStyle={{
                  flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}
                contentInset={{ bottom: 100 }}
                data={sellersAuctionVideos}
                renderItem={({ item }) => (
                  <>
                    <View style={styles.a}>
                      {!readyToDisplay && <ActivityIndicator size="large" color="black" />}
                      <Video
                        source={{
                          uri: item.videoUrl,
                        }} // Can be a URL or a local file.
                        ref={(ref) => {
                          player = ref;
                        }}
                        style={styles.backgroundVideo}
                        fullscreen={true}
                        onReadyForDisplay={() => setReadyToDisplay(true)}
                        repeat={true}
                        audioOnly={false}
                        resizeMode={'cover'}
                        playInBackground={true}
                      />
                    </View>
                    <View>
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'flex-end',
                          marginTop: 15,
                        }}>
                        {!showReportAction(item) && (
                          <TouchableOpacity
                            onPress={() =>
                              user.profil === 'admin'
                                ? showObjectionableAdminAction({
                                    item,
                                  })
                                : showObjectionableAction(item)
                            }>
                            <FontAwesomeIcon icon={faEllipsis} color={colors.DARK} size={20} />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginTop: 15,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <FontAwesomeIcon icon={faStore} size={15} />
                            <Text
                              style={{
                                fontSize: 13,
                                marginLeft: 5,
                                fontWeight: 500,
                                marginBottom: 5,
                              }}>
                              {item.sellerName}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <FontAwesomeIcon icon={faTag} size={15} />
                            <Text
                              style={{
                                fontSize: 14,
                                marginLeft: 5,
                                fontWeight: 800,
                              }}>
                              {item.productName}
                            </Text>
                          </View>
                        </View>
                        <CountDown
                          until={differenceInSeconds(item.auctionEndDate)}
                          onFinish={() => handleEndingAuction(item._id)}
                          size={15}
                          style={{
                            marginTop: 5,
                            width: 135,
                          }}
                          digitStyle={{
                            backgroundColor: 'white',
                          }}
                          digitTxtStyle={{
                            color: 'black',
                          }}
                          timeLabelStyle={{
                            fontWeight: 500,
                            fontSize: 10,
                            color: 'black',
                          }}
                          timeLabels={{
                            d: 'Jours',
                            h: 'Heurs',
                            m: 'Min',
                            s: 'Sec',
                          }}
                        />
                      </View>
                      <View
                        style={{
                          marginTop: 15,
                          marginBottom: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                marginTop: 5,
                              }}>
                              Offre initiale
                              {'     '}
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                marginTop: 0,
                              }}>
                              {item.startingPrice} €
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                marginTop: 5,
                              }}>
                              Offre en cours
                              {'     '}
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                marginTop: 0,
                              }}>
                              {item.currentPrice ? `${item.currentPrice} €` : '-'}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                marginTop: 5,
                              }}>
                              Meilleur enchérisseur
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                marginTop: 0,
                              }}>
                              {item.bestBidderUsername ? `${item.bestBidderUsername}` : '-'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: 400,
                          }}>
                          {item.productDescription}
                        </Text>
                      </View>
                      <TouchableOpacity
                        disabled={isLoading}
                        style={styles.touchableStyle}
                        onPress={() => {
                          panelRef.current?.togglePanel();
                          setSelectedOffer(item);
                          setBidStartingPrice(10);
                        }}>
                        {!isLoading ? (
                          <Text style={styles.title}>Faire une offre</Text>
                        ) : (
                          <ActivityIndicator size="small" color={colors.DARK} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <BottomSheet
                lineStyle={{ marginTop: 30 }}
                lineContainerStyle={{ margin: 0, height: 20 }}
                innerContentStyle={{ padding: 0 }}
                wrapperStyle={{
                  height: !user.hasValidPaymentMethod || !user.shipping_address ? 210 : 300,
                  padding: 0,
                }}
                sliderMinHeight={0}
                ref={(ref) => (panelRef.current = ref)}
                isOpen={false}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!user.hasValidPaymentMethod || !user.shipping_address ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '70%',
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        Oops !
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          marginBottom: 20,
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        {!user.hasValidPaymentMethod &&
                          'Sans moyen de paiement, pas de coup de marteau !'}
                        {!user.shipping_address &&
                          user.hasValidPaymentMethod &&
                          "N'oublie pas de renseigner une adresse de livraison!"}
                      </Text>
                      {renderButton()}
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          width: '100%',
                        }}>
                        <Text
                          style={{
                            fontWeight: 500,
                            marginTop: 0,
                            marginBottom: 5,
                          }}>
                          {selectedOffer.sellerName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            marginBottom: 10,
                          }}>
                          {selectedOffer.productName}
                        </Text>
                      </View>

                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 20,
                        }}>
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: 900,
                            marginTop: 0,
                          }}>
                          {bidStartingPrice}€
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: 400,
                            marginTop: 0,
                          }}>
                          Choisissez le montant que vous souhaitez enchérir.
                        </Text>
                      </View>
                      <Slider
                        value={10}
                        step={10}
                        thumbTouchSize={{
                          height: 35,
                          width: 35,
                        }}
                        thumbTintColor={'black'}
                        renderThumbComponent={() => (
                          <>
                            <View
                              style={{
                                backgroundColor: colors.DARK,
                                height: 35,
                                width: 35,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                              }}>
                              <FontAwesomeIcon icon={faAnglesRight} size={17} color={'white'} />
                            </View>
                          </>
                        )}
                        onValueChange={(value) => {
                          trigger('impactMedium', options);
                          setBidStartingPrice(Number(value[0]));
                        }}
                        trackStyle={{
                          width: 350,
                          height: 2,
                        }}
                        minimumValue={10}
                        maximumValue={500}
                      />
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: 100,
                              height: 50,
                              borderStyle: 'solid',
                              borderWidth: 2,
                              borderRadius: 8,
                              marginTop: 20,
                              marginBottom: 10,
                              marginRight: 10,
                            }}>
                            <View
                              style={{
                                padding: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontWeight: 500,
                                  color: 'grey',
                                }}>
                                Total
                              </Text>
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: 900,
                                  marginTop: 0,
                                  marginBottom: 3,
                                }}>
                                {bidStartingPrice +
                                  (selectedOffer.currentPrice || selectedOffer.startingPrice)}{' '}
                                €
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            disabled={isLoading}
                            style={styles.bidButton}
                            onPress={() => {
                              const offer =
                                bidStartingPrice +
                                (selectedOffer.currentPrice || selectedOffer.startingPrice);
                              processNewBid(selectedOffer, offer);
                              panelRef.current?.togglePanel();
                            }}>
                            {!isLoading ? (
                              <Text style={styles.title}>Enchérir</Text>
                            ) : (
                              <ActivityIndicator size="small" color={colors.DARK} />
                            )}
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: 400,
                            marginTop: 0,
                            marginBottom: 5,
                          }}>
                          Le total est la somme du montant actuel de l'article et de votre enchère
                          sélectionnée, que vous paierez si vous remportez l'enchère.
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </BottomSheet>
            </>
          ) : (
            <NoData
              title={'Aucune vidéos enchère en cours.'}
              message={'Les vidéos enchères en cours apparaîtront ici. Revenez un peu plus tard.'}
              buttonTitle={''}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onGoingLive: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: 10,
  },
  title: {
    color: colors.LIGHT,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  touchableStyle: {
    width: 370,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colors.DARK,
    borderRadius: 8,
    justifyContent: 'center',
  },
  bidButton: {
    width: 250,
    height: 50,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: colors.DARK,
    borderRadius: 8,
    justifyContent: 'center',
  },
  headlineContainer: { marginBottom: 30 },
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
  fieldContainer: { margin: 10, marginBottom: 30 },
  headline: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 30,
    width: 350,
    textAlign: 'left',
  },
  action: {},
  resetPassword: { color: 'white' },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 6,
  },
  a: {
    backgroundColor: '#ececec',
    height: 530,
    width: 370,
    marginTop: 10,
    position: 'relative',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuctionVideos;
