import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';

import NoData from '../../components/NoData/NoData';
import LiveStatus from '../../constants/LiveStatus';
import { setIsGone, setIsJoin, setLives } from '../../redux/slices/livesSlice';
import socket from '../../services/config/clientSocketIoConfig';
import colors from '../../styles/colors';
import renderLives from '../../utils/renderLives';

export const LivesScreen = ({ navigation }) => {
  const { isJoin, isGone, lives } = useSelector((state) => state.lives);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const currentLives = lives.filter(
    (live) =>
      live.live_status === LiveStatus.LIVE &&
      live.seller_id !== user.id &&
      !user.blockedUser.concat(user.blockedSeller).includes(live.seller_id),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (isGone) {
        goOut();
      }
    }, [isGone]),
  );

  const goLive = async (liveData) => {
    if (isJoin) {
      return;
    }
    try {
      socket.emit('joinChannel', { liveId: liveData._id, user });
      dispatch(setIsJoin(true));
      navigation.navigate('LiveScreen', {
        channelName: liveData.live_name,
        seller_id: liveData.seller_id,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const goOut = () => {
    try {
      dispatch(setIsGone(false));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          contentInset={{ bottom: 100 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.liveContainer}>
              {currentLives.length && !isLoading ? (
                renderLives(
                  currentLives.map((live) => ({
                    ...live,
                    imageUrl: live.imageUrl,
                  })),
                  user,
                  goLive,
                )
              ) : (
                <></>
              )}
              {!currentLives.length && !isLoading && (
                <NoData
                  title={'Aucun live en cours'}
                  message={'Les lives en cours apparaîtront ici. Revenez un peu plus tard.'}
                  buttonTitle={''}
                />
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
  liveContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    margin: 26,
    marginTop: 23,
    padding: 0,
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
});

export default LivesScreen;
