import React, {useEffect} from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    ImageBackground,
    Image,
    ActivityIndicator,
} from 'react-native';
import colors from '../../styles/colors';
import {DateTime} from 'luxon';

export const LiveCard = ({
    onPress,
    sellerName,
    description,
    category,
    imageUrl,
    status,
    datetime,
    imageKey,
}) => {
    useEffect(() => {}, []);
    return (
        <View
            style={{
                width: 160,
                height: 250,
                margin: 10,
                marginBottom: 60,
                marginTop: 0,
                borderRadius: 5,
            }}>
            <View
                style={{
                    marginBottom: 10,
                }}>
                <View
                    style={{
                        width: 130,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <View style={{height: 25, width: 25, borderRadius: 4, backgroundColor: 'black'}}>
                        <Image
                            key={imageKey}
                            style={{height: 25, width: 25, borderRadius: 4, opacity: 0.7}}
                            source={
                                imageUrl
                                    ? {uri: imageUrl, cache: 'reload'}
                                    : require('../../../assets/images/liveshopp_back_lives.png')
                            }
                        />
                    </View>
                    <Text numberOfLines={1} style={styles.sellerName}>
                        {sellerName}
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.touchableStyle} onPress={onPress}>
                {!imageUrl ? (
                    <View
                        style={{
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                        }}>
                        <ActivityIndicator
                            size="large"
                            color={colors.PRIMARY}
                        />
                    </View>
                ) : (
                    <ImageBackground
                        key={imageKey}
                        source={
                            imageUrl
                                ? {uri: imageUrl, cache: 'reload'}
                                : require('../../../assets/images/liveshopp_back_lives.png')
                        }
                        imageStyle={{
                            opacity: 0.7,
                            width: 160,
                            height: 250,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                width: 140,
                                height: 230,
                            }}>
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    borderColor: 'white',
                                    position: 'absolute',
                                    top: 10,
                                    width: '100%',
                                    alignItems: 'center',
                                    paddingTop: 0,
                                }}>
                                {status === 'live' ? (
                                    <View
                                        style={{
                                            borderColor: colors.PRIMARY,
                                            borderWidth: 1,
                                            textAlign: 'left',
                                            fontWeight: 'bold',
                                            fontSize: 13,
                                            backgroundColor: colors.PRIMARY,
                                            padding: 4,
                                            paddingRight: 10,
                                            paddingLeft: 10,
                                            marginLeft: 10,
                                            borderRadius: 4,
                                        }}>
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                color: colors.LIGHT,
                                                fontSize: 12,
                                            }}>
                                            En direct
                                        </Text>
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            borderColor: colors.LIGHT,
                                            borderWidth: 1,
                                            textAlign: 'left',
                                            fontWeight: 'bold',
                                            fontSize: 13,
                                            width: '100%',
                                            backgroundColor: colors.LIGHT,
                                            padding: 4,
                                            paddingRight: 10,
                                            paddingLeft: 10,
                                            marginLeft: 10,
                                            borderRadius: 3,
                                        }}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: colors.DARK,
                                                fontSize: 11,
                                                backgroundColor: colors.LIGHT,
                                            }}>
                                            {DateTime.fromISO(
                                                datetime,
                                            ).toLocaleString({
                                                month: 'short',
                                                day: 'numeric',
                                                weekday: 'short',
                                            })}
                                            {' à '}
                                            {DateTime.fromISO(
                                                datetime,
                                            ).toLocaleString(
                                                DateTime.TIME_SIMPLE,
                                            )}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 70,
                                    left: 0,
                                    width: '100%',
                                    marginLeft: 10,
                                }}>
                                <Text
                                    numberOfLines={8}
                                    style={styles.description}>
                                    {description}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                )}
            </TouchableOpacity>
            <View
                style={{
                    textAlign: 'left',
                    width: '100%',
                    marginTop: 5,
                }}>
                <Text style={styles.category}>{category}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sellerName: {
        color: colors.DARK,
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 12,
        width: '100%',
        marginLeft: 5,
    },
    description: {
        color: colors.LIGHT,
        fontSize: 12,
        textAlign: 'left',
    },
    datetime: {
        color: colors.LIGHT,
        textAlign: 'left',
        fontSize: 13,
    },
    category: {
        color: colors.DARK,
        textAlign: 'left',
        fontSize: 12,
        fontWeight: 600,
    },
    touchableStyle: {
        width: 160,
        height: 250,
        borderRadius: 5,
        backgroundColor: 'black',
    },
});

export default LiveCard;
