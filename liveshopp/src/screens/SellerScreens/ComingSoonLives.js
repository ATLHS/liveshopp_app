import React, { useEffect, useState } from 'react';
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
import LiveStatus from '../../constants/LiveStatus';
import UserType from '../../constants/UserType';
import live from '../../services/live';
import colors from '../../styles/colors';
import { checkAndUpdateLiveStatus } from '../../utils/checkAndUpdateLiveStatus';
import renderLives from '../../utils/renderLives';

export const CommingSoonLives = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const { sellerLives } = useSelector((state) => state.lives);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [liveToDelete, setLiveToDelete] = useState({});
  const dispatch = useDispatch();
  const upComingLives = sellerLives.filter((live) => live.live_status === LiveStatus.UPCOMING);

  const deleteLive = (liveData) => {
    setIsLoading(true);
    live
      .deleteLive(liveData)
      .then((res) => res)
      .then((data) => {
        setIsLoading(false);
        setModalVisible(!modalVisible);
        Toast.show({
          type: 'toastSuccess',
          text1: data.message,
        });
        checkAndUpdateLiveStatus(data.sellerLives, dispatch, UserType.SELLER);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const promptLiveDeletion = (live) => {
    setModalVisible(!modalVisible);
    setLiveToDelete(live);
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
              <View style={styles.liveContainer}>
                {upComingLives.length && !isLoading ? (
                  renderLives(
                    upComingLives.map((live) => ({
                      ...live,
                      imageUrl: user.imageUrl,
                    })),
                    user,
                    promptLiveDeletion,
                  )
                ) : (
                  <></>
                )}
                {!upComingLives.length && !isLoading && (
                  <NoData
                    title={"Vous n'avez aucun live terminé"}
                    message={'Tous vos lives terminé \n apparaîtront ici.'}
                  />
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

export default CommingSoonLives;
