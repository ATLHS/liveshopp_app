import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import NoData from '../../components/NoData/NoData';
import LiveCard from '../../components/liveCard/liveCard';
import { setSellerLives } from '../../redux/slices/livesSlice';
import live from '../../services/live';
import colors from '../../styles/colors';

export const CommingSoonLives = ({ navigation }) => {
  const { sellerLives } = useSelector((state) => state.lives);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [liveToDelete, setLiveToDelete] = useState({});
  const dispatch = useDispatch();

  const deleteLive = (liveData) => {
    setIsLoading(true);
    live
      .deleteLive(liveData)
      .then((res) => res)
      .then((data) => {
        setIsLoading(false);
        setModalVisible(!modalVisible);
        Toast.show({
          type: 'success',
          text1: data.message,
        });
        dispatch(setSellerLives(data.lives));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
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
            <>
              <Modal animationType="fade" transparent={true} visible={modalVisible}>
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
                      height: 130,
                      width: 220,
                      borderRadius: 10,
                      backgroundColor: colors.LIGHT,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
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
                          fontFamily: 'FugazOne-Regular',
                        }}>
                        SUPRIMER LE LIVE :{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          margin: 5,
                        }}>
                        {liveToDelete.live_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '100%',
                      }}>
                      <View
                        style={{
                          margin: 10,
                          height: 30,
                        }}>
                        <TouchableOpacity
                          style={{
                            height: 40,
                            width: 70,
                            backgroundColor: 'black',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => deleteLive(liveToDelete)}>
                          <Text
                            style={{
                              color: colors.LIGHT,
                              textAlign: 'center',
                              fontSize: 20,
                            }}>
                            oui
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          margin: 10,
                          borderRadius: 10,
                          height: 30,
                        }}>
                        <TouchableOpacity
                          style={{
                            height: 40,
                            width: 70,
                            backgroundColor: 'black',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => setModalVisible(!modalVisible)}>
                          <Text
                            style={{
                              color: colors.LIGHT,
                              textAlign: 'center',
                              fontSize: 20,
                            }}>
                            non
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Modal>
              <View style={styles.onGoingLive}>
                {sellerLives.filter((live) => live.live_status === 'coming_soon').length &&
                !isLoading
                  ? sellerLives
                      .filter((live) => live.live_status === 'coming_soon')
                      .map((live, id) => (
                        <LiveCard
                          key={id}
                          sellerName={live.sellerName}
                          title={live.live_name}
                          datetime={live.live_date_time}
                          description={live.live_description}
                          category={live.business_activity}
                          status={live.live_status}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                            if (live.live_status === 'coming_soon') {
                              setLiveToDelete(live);
                            }
                          }}
                          imageUrl={live.imageUrl}
                        />
                      ))
                  : ''}
                {sellerLives.filter((live) => live.live_status === 'coming_soon').length &&
                !isLoading ? (
                  <View
                    style={{
                      width: 140,
                      height: 230,
                      margin: 10,
                      backgroundColor: 'transparent',
                    }}
                  />
                ) : !sellerLives.filter((live) => live.live_status === 'coming_soon').length &&
                  !isLoading ? (
                  <NoData
                    title={"Vous n'avez aucun live à venir"}
                    message={'Tous vos lives programmés \n apparaîtront ici.'}
                    buttonTitle={'Créer un live maintenant ?'}
                    onPress={() => navigation.navigate('SettingNewLive')}
                  />
                ) : (
                  <View
                    style={{
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color={colors.DARK} />
                  </View>
                )}
              </View>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
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
  onGoingLive: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
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

export default CommingSoonLives;
