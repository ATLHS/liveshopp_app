import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import LiveCard from '../../components/liveCard/liveCard';
import { setIsGone, setIsJoin, setLives } from '../../redux/slices/livesSlice';
import socket from '../../services/config/clientSocketIoConfig';
import live from '../../services/live';
import colors from '../../styles/colors';

export const LivesScreen = ({ navigation }) => {
  const { isJoin, isGone } = useSelector((state) => state.lives);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [onGoingLives, setOnGoingLives] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      dispatch(setLives([]));

      live
        .getLives()
        .then((res) => res)
        .then((data) => {
          dispatch(setLives(data.lives));
          setOnGoingLives(
            data.lives.filter(
              (live) =>
                live.seller_id !== user.id &&
                live.live_status === 'live' &&
                !user.blockedUser.concat(user.blockedSeller).includes(live.seller_id),
            ),
          );
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err, 'get lives error.');
          setIsLoading(false);
        });
    }, []),
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
            <View style={styles.onGoingLive}>
              {isLoading ? (
                <View
                  style={{
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : onGoingLives.length ? (
                <>
                  {onGoingLives.map((live, id) => (
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
                  <View
                    style={{
                      width: 150,
                      height: 230,
                      margin: 10,
                      backgroundColor: 'transparent',
                    }}
                  />
                </>
              ) : (
                <NoData
                  title={'Aucun live en cours'}
                  message={'Les lives en cours apparaîtront ici, reviens un peu plus tard.'}
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
  onGoingLive: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: 10,
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
