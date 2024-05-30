import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-fixed';
import { useDispatch, useSelector } from 'react-redux';

import { DateTime } from 'luxon';

import { faCircleInfo, faGavel, faStore, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';

import NoData from '../../components/NoData/NoData';
import { setSellerAuctionVideos } from '../../redux/slices/auctionsVideoSlice';
import auctionVideoService from '../../services/auctionVideos';
import colors from '../../styles/colors';

export const SellerAuctionVideos = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { sellerAuctionVideos } = useSelector((state) => state.auctionVideos);
  const dispatch = useDispatch();

  const differenceInSeconds = (enDate) => {
    const now = DateTime.now();
    const dateCible = DateTime.fromISO(enDate);
    const differenceEnSecondes = dateCible.diff(now, 'seconds').toObject().seconds;

    return differenceEnSecondes;
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      auctionVideoService
        .getSellerAuctionVideo()
        .then((res) => res)
        .then((data) => {
          dispatch(
            setSellerAuctionVideos(
              data.auctionVideos.filter((auctionVideo) => auctionVideo.auctionStatus === 'onGoing'),
            ),
          );
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <>
          {!isLoading && sellerAuctionVideos.length ? (
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              contentInset={{ bottom: 100 }}
              data={sellerAuctionVideos}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    width: 370,
                    borderRadius: 6,
                    borderStyle: 'solid',
                    borderWidth: 0,
                    marginBottom: 10,
                    marginTop: 12,
                    borderColor: colors.DARK,
                    position: 'relative',
                    padding: 10,
                    backgroundColor: '#F4F4F4',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
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
                      size={15}
                      // style={{marginTop: 5}}
                      digitStyle={{
                        backgroundColor: '#F4F4F4',
                        height: 15,
                      }}
                      digitTxtStyle={{
                        color: 'black',
                      }}
                      timeLabelStyle={{
                        fontWeight: 500,
                        fontSize: 10,
                        height: 10,
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
                  <View style={{ marginBottom: 15 }}>
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
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 2,
                      }}>
                      <FontAwesomeIcon icon={faCircleInfo} size={15} />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginLeft: 5,
                          color: item.currentPrice > item.reservePrice ? 'green' : 'grey',
                        }}>
                        Prix de réserve atteint :{' '}
                        {item.currentPrice > item.reservePrice ? 'oui' : 'non'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 2,
                      }}>
                      <FontAwesomeIcon icon={faGavel} size={15} />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginLeft: 5,
                          color: colors.DARK,
                        }}>
                        Prix de réserve : {item.reservePrice} €
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <NoData
              title={"Vous n'avez aucune vidéos enchère en cours."}
              message={'Vos vidéos enchères apparaîtront ici.'}
              buttonTitle={'Créer une vidéo enchère maintenant ?'}
              onPress={() => navigation.navigate('auctionVideoSettings')}
            />
          )}
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveContainerInfos: {
    alignItems: 'center',
  },
  onGoingLiveContainer: {
    backgroundColor: 'transparent',
  },
  onGoingLive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  liveContainer: {
    width: 350,
    textAlign: 'center',
    height: '85%',
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 15,
  },
  liveContainerUsers: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: colors.LIGHT,
  },
  liveContainerIcon: {
    fontFamily: 'Roboto-Regular',
    fontSize: 25,
    color: colors.LIGHT,
  },
  title: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 25,
    margin: 5,
    alignItems: 'center',
  },
  description: {
    fontSize: 15,
    marginTop: 30,
    color: colors.LIGHT,
    textAlign: 'center',
    width: 300,
  },
  hour: {
    fontSize: 20,
    marginTop: 30,
    fontWeight: 500,
    color: colors.LIGHT,
  },
  liveContainerLiveInfos: {
    alignItems: 'center',
    marginTop: 70,
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  liveContainerInfosIcons: {
    marginTop: 25,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SellerAuctionVideos;
