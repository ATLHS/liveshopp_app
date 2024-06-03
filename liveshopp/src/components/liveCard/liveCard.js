import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DateTime } from 'luxon';

import colors from '../../styles/colors';

const LiveCard = ({
  onPress,
  sellerName,
  description,
  category,
  imageUrl,
  status,
  datetime,
  imageKey,
}) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // Parse the date
  const date = DateTime.fromISO(datetime);
  const now = DateTime.now();

  // Check if the date is today
  const isToday = date.hasSame(now, 'day', {});

  // Format the date string
  const formattedDate = isToday
    ? "Aujourd'hui"
    : DateTime.fromISO(datetime).toLocaleString({
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      });

  return (
    <View style={[styles.card, { width: dimensions.width * 0.4, height: dimensions.width * 0.65 }]}>
      <View style={styles.sellerContainer}>
        <View style={styles.avatarContainer}>
          <Image
            key={imageKey}
            style={styles.avatar}
            source={
              imageUrl
                ? { uri: imageUrl, cache: 'reload' }
                : require('../../../assets/images/liveshopp_back_lives.png')
            }
          />
        </View>
        <Text numberOfLines={1} style={styles.sellerName}>
          {sellerName}
        </Text>
      </View>

      <TouchableOpacity style={styles.touchableStyle} onPress={onPress}>
        <ImageBackground
          key={imageKey}
          source={
            imageUrl
              ? { uri: imageUrl, cache: 'reload' }
              : require('../../../assets/images/liveshopp_back_lives.png')
          }
          imageStyle={styles.imageBackground}
          style={styles.imageContainer}>
          <View style={styles.statusContainer}>
            {status === 'live' ? (
              <View style={styles.liveStatut}>
                <Text style={styles.liveText}>En direct</Text>
              </View>
            ) : (
              <View style={styles.datetimeTextContainer}>
                <Text style={styles.datetimeText}>
                  {formattedDate}
                  {' à '}
                  {DateTime.fromISO(datetime).toLocaleString(DateTime.TIME_SIMPLE)}
                </Text>
              </View>
            )}
          </View>
          <Text numberOfLines={8} style={styles.description}>
            {description}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
      <Text style={styles.category}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: '20%',
    marginTop: 0,
    borderRadius: 5,
  },
  header: {
    flexDirection: 'column',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryContainer: {
    marginTop: 30,
  },
  avatarContainer: {
    height: 25,
    width: 25,
    borderRadius: 4,
    backgroundColor: 'black',
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 4,
    opacity: 0.7,
  },
  sellerName: {
    color: colors.DARK,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
    flexShrink: 1,
  },
  touchableStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  imageBackground: {
    opacity: 0.7,
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  statusContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 8,
    width: '100%',
  },
  liveText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.LIGHT,
    fontSize: 12,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    width: '50%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  liveStatut: { width: '90%', borderWidth: 0 },
  datetimeTextContainer: {
    borderColor: colors.LIGHT,
    borderWidth: 1,
    width: '90%',
    backgroundColor: colors.LIGHT,
    padding: 5,
    borderRadius: 3,
  },
  datetimeText: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    color: colors.DARK,
  },
  description: {
    color: colors.LIGHT,
    fontSize: 12,
    textAlign: 'left',
    marginTop: 70,
    marginLeft: 10,
  },
  category: {
    color: colors.DARK,
    textAlign: 'left',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
});

export default LiveCard;
