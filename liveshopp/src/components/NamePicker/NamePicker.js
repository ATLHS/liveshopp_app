import React, {useState, useCallback} from 'react';
import {View, Text, Modal, Pressable, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {useFocusEffect} from '@react-navigation/native';

const NamePicker = ({
    giveawayParticipants,
    givewayModalVisible,
    setShowGivewayModalVisible,
}) => {
    const [name, setName] = useState(giveawayParticipants[0]);
    const [isRendering, setIsRendering] = useState(true);

    const interval = 100;

    const pickWinner = () => {
        const randomName =
            giveawayParticipants[
                Math.floor(Math.random() * giveawayParticipants.length)
            ];
        setName(randomName);
    };

    const stopInterval = () => {
        setIsRendering(false);
    };

    useFocusEffect(
        useCallback(() => {
            const intervalId = setInterval(pickWinner, interval);

            setTimeout(() => {
                stopInterval();
                clearInterval(intervalId);
            }, 4000);

            return () => {
                clearInterval(intervalId);
            };
        }, []),
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={givewayModalVisible}>
            <Pressable
                onPress={() => setShowGivewayModalVisible(false)}
                style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.innerContent}>
                        <Text style={styles.loadingText}>
                            And the winner is{isRendering && '... 🥁'}
                        </Text>
                        <Text style={styles.winnerText}>
                            {isRendering ? name : `${name} 🥳`}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.60)',
    },
    modalContent: {
        height: 100,
        width: 300,
        borderRadius: 5,
        backgroundColor: colors.LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    innerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    loadingText: {
        fontSize: 17,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
        marginBottom: 10,
    },
    winnerText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default NamePicker;
