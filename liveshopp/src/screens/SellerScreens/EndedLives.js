import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';
import LiveCard from '../../components/liveCard/liveCard';
import NoData from '../../components/NoData/NoData';

export const EndedLives = () => {
    const {sellerLives} = useSelector(state => state.lives);
    const [isLoading, setIsLoading] = useState(false);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}
                    contentInset={{bottom: 100}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.endedLive}>
                            {sellerLives.filter(
                                live => live.live_status === 'ended',
                            ).length && !isLoading
                                ? sellerLives
                                      .filter(
                                          live => live.live_status === 'ended',
                                      )
                                      .map((live, id) => (
                                          <LiveCard
                                              key={id}
                                              sellerName={live.sellerName}
                                              title={live.live_name}
                                              datetime={live.live_date_time}
                                              description={
                                                  live.live_description
                                              }
                                              category={live.business_activity}
                                              status={live.live_status}
                                              onPress={null}
                                              imageUrl={live.liveImageUrl}
                                          />
                                      ))
                                : ''}
                            {sellerLives.filter(
                                live => live.live_status === 'ended',
                            ).length && !isLoading ? (
                                <View
                                    style={{
                                        width: 140,
                                        height: 230,
                                        margin: 10,
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            ) : !sellerLives.filter(
                                  live => live.live_status === 'ended',
                              ).length && !isLoading ? (
                                <NoData
                                    title={"Vous n'avez aucun live terminé"}
                                    message={
                                        'Tous vos lives terminé \n apparaîtront ici.'
                                    }
                                />
                            ) : (
                                <View
                                    style={{
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.DARK}
                                    />
                                </View>
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
    endedLive: {
        flex: 1,
        alignItems: 'center',
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

export default EndedLives;
