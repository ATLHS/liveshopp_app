import React, { useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';

import NoData from '../../components/NoData/NoData';
import LiveStatus from '../../constants/LiveStatus';
import colors from '../../styles/colors';
import renderLives from '../../utils/renderLives';

export const EndedLives = () => {
  const { sellerLives } = useSelector((state) => state.lives);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const endedLives = sellerLives.filter((live) => live.live_status === LiveStatus.ENDED);

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
              {endedLives.length && !isLoading ? (
                renderLives(
                  endedLives.map((live) => ({
                    ...live,
                    imageUrl: user.imageUrl,
                  })),
                  user,
                )
              ) : (
                <></>
              )}
              {!endedLives.length && !isLoading && (
                <NoData
                  title={"Vous n'avez aucun live terminé"}
                  message={'Tous vos lives terminés \n apparaîtront ici.'}
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
  liveContainerInfos: {
    alignItems: 'center',
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
  headlineMessage: {
    color: colors.LIGHT,
    fontFamily: 'Roboto-Regular',
    fontSize: 25,
    margin: 5,
    alignItems: 'center',
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
  liveContainerInfosIcon: {
    marginTop: 25,
    width: '85%',
    alignItems: 'flex-start',
  },
});

export default EndedLives;
