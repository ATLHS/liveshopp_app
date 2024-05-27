import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';

const MessageHelper = ({fieldState: {error}}) => {
    const isAuthenticate = useSelector(state => state.user.isAuthenticate);
    return (
        <View>
            <Text
                style={
                    isAuthenticate
                        ? outlinedStyles.error_message
                        : containedStyles.error_message
                }>
                {error && error.message}
            </Text>
        </View>
    );
};

const containedStyles = StyleSheet.create({
    error_message: {
        backgroundColor: 'black',
        color: colors.PRIMARY,
        marginBottom: 15,
        width: 350,
    },
});
const outlinedStyles = StyleSheet.create({
    error_message: {
        backgroundColor: colors.LIGHT,
        color: colors.PRIMARY,
        marginBottom: 15,
        width: 350,
    },
});

export default MessageHelper;
