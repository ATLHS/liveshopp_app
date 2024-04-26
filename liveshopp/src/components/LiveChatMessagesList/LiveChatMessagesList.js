import React from 'react';
import colors from '../../styles/colors';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsis} from '@fortawesome/free-solid-svg-icons';

const LiveChatMessagesList = ({
    list,
    liveData,
    user,
    showObjectionableAction,
    showObjectionableAdminAction,
}) => {
    return (
        <FlatList
            ref={list}
            showsVerticalScrollIndicator={false}
            contentInset={{top: 0, bottom: 40, left: 0, right: 0}}
            style={styles.flatList}
            data={liveData.messages}
            renderItem={({item}) => {
                const isAdmin = item.profil === 'admin';
                const isBlocked = user.blockedUser
                    .concat(user.blockedSeller)
                    .includes(item.userId);
                const isCurrentUser = user.id === item.userId;
                return (
                    !isBlocked && (
                        <View style={styles.container}>
                            <View style={styles.itemContainer}>
                                <View style={styles.userInfoContainer}>
                                    <Text style={styles.usernameText}>
                                        {item.username}{' '}
                                    </Text>
                                    {isAdmin && (
                                        <View style={styles.adminBadge}>
                                            <Text style={styles.adminBadgeText}>
                                                Admin
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                {!isCurrentUser && !isAdmin && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            user.profil === 'admin'
                                                ? showObjectionableAdminAction({
                                                      item,
                                                  })
                                                : showObjectionableAction(item)
                                        }>
                                        <FontAwesomeIcon
                                            icon={faEllipsis}
                                            color={colors.LIGHT}
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text style={styles.messageText}>
                                {item.message}
                            </Text>
                        </View>
                    )
                );
            }}
            keyExtractor={item => item.id}
        />
    );
};

const styles = StyleSheet.create({
    flatList: {
        height: 150,
        width: 323,
        marginBottom: 15,
        backgroundColor: 'transparent',
    },
    container: {
        marginBottom: 5,
    },
    itemContainer: {
        marginTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    usernameText: {
        color: colors.LIGHT,
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 3,
    },
    adminBadge: {
        backgroundColor: colors.LIGHT,
        color: colors.DARK,
        borderRadius: 2,
        alignItems: 'center',
        marginBottom: 3,
        padding: 2,
        paddingRight: 4,
        paddingLeft: 4,
    },
    adminBadgeText: {
        color: colors.DARK,
        fontWeight: '700',
        fontSize: 10,
    },
    messageText: {
        color: colors.LIGHT,
        fontSize: 14,
    },
});

export default LiveChatMessagesList;
