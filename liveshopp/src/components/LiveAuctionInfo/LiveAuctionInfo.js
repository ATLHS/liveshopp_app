import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';

import { Duration } from 'luxon';

import colors from '../../styles/colors';

export const LiveAuctionInfo = () => {
  const { liveData } = useSelector((state) => state.lives);
  const [time, setTime] = useState(Number);
  const [displayedTime, setDisplayedTime] = useState('00:00');
  const handleViewRef = useRef(null);

  useEffect(() => {
    setTime(liveData.currentAuction.currentAuctionTimer);

    const duration = Duration.fromObject({ seconds: liveData.currentAuction.currentAuctionTimer });
    setDisplayedTime(duration.toFormat('mm:ss'));

    if (liveData.currentAuction.currentAuctionTimer <= 10) {
      handleViewRef.current?.pulse();
    }
  }, [liveData.currentAuction.currentAuctionTimer]);

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{liveData.currentAuction.productName}</Text>
      {liveData.currentAuction.currentMessageInfo && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{liveData.currentAuction.currentMessageInfo}</Text>
        </View>
      )}
      <View style={styles.auctionInfoContainer}>
        <View style={styles.auctionAmountContainer}>
          <Text style={styles.auctionAmountText}>
            {liveData.currentAuction.currentProductAmount} €
          </Text>
          <Text style={styles.auctionLabel}>Enchère en cours</Text>
        </View>
        <View style={styles.timeContainer}>
          <Animatable.Text
            ref={(ref) => (handleViewRef.current = ref)}
            easing="ease-out"
            iterationCount="infinite"
            style={[styles.timeText, time <= 10 && { color: colors.PRIMARY }]}>
            {displayedTime}
          </Animatable.Text>
          <Text style={styles.remainingTimeLabel}>Temps restant</Text>
        </View>
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>{liveData.currentAuction.username.toUpperCase()}</Text>
          <Text style={styles.winnerLabel}>Remporte l'enchère</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    padding: 15,
    alignItems: 'center',
  },
  productName: {
    width: 350,
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    fontWeight: '500',
    padding: 15,
  },
  messageContainer: {
    width: 320,
    paddingBottom: 0,
    justifyContent: 'center',
    height: 30,
    paddingRight: 15,
    borderRadius: 4,
  },
  messageText: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
  },
  auctionInfoContainer: {
    height: 70,
    width: 350,
    backgroundColor: 'transparent',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
  },
  auctionAmountContainer: {
    width: 100,
    height: 40,
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  auctionAmountText: {
    color: colors.LIGHT,
    fontSize: 20,
    fontFamily: 'FugazOne-Regular',
  },
  auctionLabel: {
    color: colors.LIGHT,
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    fontWeight: '800',
  },
  timeContainer: {
    width: 85,
    height: 40,
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  timeText: {
    color: colors.LIGHT,
    fontSize: 20,
    fontFamily: 'FugazOne-Regular',
    marginBottom: 2,
  },
  remainingTimeLabel: {
    color: colors.LIGHT,
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    fontWeight: '800',
  },
  winnerContainer: {
    width: 100,
    height: 40,
    justifyContent: 'flex-end',
  },
  winnerText: {
    color: colors.LIGHT,
    fontSize: 12,
    fontFamily: 'FugazOne-Regular',
    marginBottom: 2,
  },
  winnerLabel: {
    color: colors.LIGHT,
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    fontWeight: '800',
  },
});

export default LiveAuctionInfo;
