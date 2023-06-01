import {StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/colors';
import React, {useEffect, useState, useRef} from 'react';
import {useSelector} from 'react-redux';

export const LiveAuctionInfo = () => {
    const {liveData} = useSelector(state => state.lives);

    return (
        <View
            style={{
                height: 70,
                width: 350,
                backgroundColor: 'transparent',
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 15,
            }}>
            <View style={{width: 80, height: 40, justifyContent: 'flex-end'}}>
                <Text
                    style={{
                        color: colors.LIGHT,
                        fontSize: 20,
                        fontFamily: 'FugazOne-Regular',
                    }}>
                    {liveData.currentAuction.currentProductAmount} €
                </Text>
                <Text
                    style={{
                        color: colors.LIGHT,
                        fontSize: 10,
                        fontFamily: 'Roboto-Regular',
                        fontWeight: '800',
                    }}>
                    Enchère en cours
                </Text>
            </View>
            <View style={{width: 80, height: 40, justifyContent: 'flex-end'}}>
                <Text
                    style={{
                        color: colors.LIGHT,
                        fontSize: 20,
                        fontFamily: 'FugazOne-Regular',
                        marginBottom: 2,
                    }}>
                    {liveData.currentAuction.currentAuctionDelay.time}
                </Text>
                <Text
                    style={{
                        color: colors.LIGHT,
                        fontSize: 10,
                        fontFamily: 'Roboto-Regular',
                        fontWeight: '800',
                    }}>
                    Temps restant
                </Text>
            </View>
            <View style={{width: 120, height: 40, justifyContent: 'flex-end'}}>
                <Text
                    style={{
                        color: colors.LIGHT,
                        fontSize: 11,
                        fontFamily: 'FugazOne-Regular',
                        marginBottom: 2,
                    }}>
                    {liveData.currentAuction.username.toUpperCase()}
                </Text>
                <Text
                    style={{
                        color: colors.LIGHT,
                        fontSize: 10,
                        fontFamily: 'Roboto-Regular',
                        fontWeight: '800',
                    }}>
                    Remporte l'enchère
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default LiveAuctionInfo;
