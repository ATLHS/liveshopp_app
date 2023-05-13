import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    ImageBackground,
} from 'react-native';
import colors from '../../styles/colors';
import {DateTime} from 'luxon';

const liveCard = ({
                      onPress,
                      sellerName,
                      description,
                      category,
                      imageUrl,
                      status,
                      datetime,
                  }) => {
    return (
        <TouchableOpacity style={styles.touchableStyle} onPress={onPress}>
            <ImageBackground
                source={
                    imageUrl
                        ? {uri: imageUrl}
                        : require('../../../assets/images/liveshopp_back_lives.png')
                }
                imageStyle={{
                    opacity: 0.3,
                    width: 150,
                    height: 230,
                    borderRadius: 10,
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
                            padding: 10,
                            paddingTop: 0,
                        }}>
                        {status === 'live' && (
                            <View
                                style={{
                                    borderColor: 'white',
                                    borderWidth: 1,
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontSize: 13,
                                    backgroundColor: colors.LIGHT,
                                    padding: 1,
                                    paddingRight: 6,
                                    paddingLeft: 6,
                                    borderRadius: 2,
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        color: colors.PRIMARY,
                                        fontSize: 9,
                                    }}>
                                    LIVE
                                </Text>
                            </View>
                        )}
                        <Text
                            style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                                color: colors.LIGHT,
                                fontSize: 13,
                            }}
                        />
                    </View>
                    <View style={{position: 'absolute', top: 30, left: 0, padding: 10}}>
                        <Text numberOfLines={1} style={styles.sellerName}>
                            {sellerName}
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                marginTop: 3,
                                fontWeight: 500,
                                color: colors.LIGHT,
                            }}>
                            {DateTime.fromISO(datetime).toLocaleString(
                                DateTime.DATE_MED_WITH_WEEKDAY,
                            )}
                        </Text>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            top: 70,
                            left: 0,
                            padding: 10,
                            width: '100%',
                        }}>
                        <Text numberOfLines={7} style={styles.description}>
                            {description}
                        </Text>
                    </View>
                    <View style={{position: 'absolute', bottom: 0, left: 0, padding: 10}}>
                        <Text style={styles.category}>{category} </Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sellerName: {
        color: colors.LIGHT,
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 13,
        width: '100%',
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
        color: colors.LIGHT,
        textAlign: 'left',
        fontSize: 13,
        fontWeight: 'bold',
    },
    touchableStyle: {
        width: 150,
        height: 230,
        margin: 10,
        backgroundColor: colors.DARK,
        borderRadius: 10,
    },
});

export default liveCard;
