import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const LiveChatMessagesList = ({
  list,
  liveData,
  user,
  showObjectionableAction,
  showObjectionableAdminAction,
}) => {
  const getItemLayout = (data, index) => ({
    length: 200,
    offset: 100 * index,
    index,
  });

  return (
    <FlatList
      ref={list}
      showsVerticalScrollIndicator={false}
      initialScrollIndex={liveData.messages.length && liveData.messages.length - 1}
      getItemLayout={getItemLayout}
      contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
      style={styles.flatList}
      data={liveData.messages}
      renderItem={({ item }) => {
        const isAdmin = item.profil === 'admin';
        const isBlocked = user.blockedUser.concat(user.blockedSeller).includes(item.userId);
        const isCurrentUser = user.id === item.userId;
        return (
          !isBlocked && (
            <View style={styles.container}>
              <View style={styles.itemContainer}>
                <View style={styles.userInfoContainer}>
                  {item.userId === user.id ? (
                    <Text style={styles.usernameText}>{item.username}</Text>
                  ) : (
                    <Text style={styles.usersText}>{item.username}</Text>
                  )}
                  {isAdmin && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Admin</Text>
                    </View>
                  )}
                </View>
                {!isCurrentUser && !isAdmin && Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={{ marginBottom: 5 }}
                    onPress={() =>
                      user.profil === 'admin'
                        ? showObjectionableAdminAction({
                            item,
                          })
                        : showObjectionableAction(item)
                    }>
                    <FontAwesomeIcon icon={faEllipsis} color={colors.LIGHT} size={20} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )
        );
      }}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    height: 230,
    width: '95%',
    backgroundColor: 'transparent',
    marginBottom: 25,
  },
  container: {
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  usernameText: {
    color: '#FFCD71',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 0,
  },
  usersText: {
    color: colors.LIGHT,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 0,
  },
  adminBadge: {
    backgroundColor: colors.LIGHT,
    color: colors.DARK,
    borderRadius: 2,
    alignItems: 'center',
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
