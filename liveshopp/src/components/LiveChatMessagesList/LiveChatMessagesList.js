import { useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const LiveChatMessagesList = ({
  messages,
  user,
  showObjectionableAction,
  showObjectionableAdminAction,
}) => {
  const listRef = useRef(null);
  const [itemsHeight, setItemsHeight] = useState([]);

  const getItemHeight = (index) => {
    if (itemsHeight[index] === undefined) {
      return 50;
    }
    return itemsHeight[index];
  };

  const getItemOffset = (index) => {
    if (itemsHeight[index] === undefined) {
      return 0;
    }
    return itemsHeight.slice(0, index).reduce((a, c) => a + c, 0);
  };

  const getItemLayout = (_data, index) => ({
    length: getItemHeight(index),
    offset: getItemOffset(index),
    index,
  });

  const renderItem = ({ item, index }) => {
    const isAdmin = item.profil === 'admin';
    const isBlocked = user.blockedUser.concat(user.blockedSeller).includes(item.userId);
    const isCurrentUser = user.id === item.userId;
    return (
      !isBlocked && (
        <View
          style={styles.container}
          onLayout={(event) => {
            // We get the cell's height dynamically to be reused in getItemLayout() computation
            const height = event.nativeEvent.layout.height + 10; // 10 is the extra margin bottom
            itemsHeight[index] = height;

            // If we render the last item, trigger scroll in 50ms
            if (index === messages.length - 1) {
              setTimeout(() => listRef.current?.scrollToEnd(), 50);
            }
          }}>
          <View style={styles.itemContainer}>
            <View style={styles.userInfoContainer}>
              <Text style={item.userId === user.id ? styles.usernameText : styles.usersText}>
                {item.username}
              </Text>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              )}
            </View>
            {!isCurrentUser && !isAdmin && Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.pressable}
                onPress={() => {
                  user.profil === 'admin'
                    ? showObjectionableAdminAction({ item })
                    : showObjectionableAction({ item });
                }}>
                <FontAwesomeIcon icon={faEllipsis} color={colors.LIGHT} size={20} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      )
    );
  };

  return (
    <FlatList
      ref={listRef}
      style={styles.flatList}
      removeClippedSubviews={true}
      initialNumToRender={messages.length}
      data={messages}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
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
    lineHeight: 2,
    minHeight: 40,
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
    lineHeight: 20,
  },
  usersText: {
    color: colors.LIGHT,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 0,
    lineHeight: 20,
  },
  adminBadge: {
    backgroundColor: colors.LIGHT,
    color: colors.DARK,
    borderRadius: 2,
    alignItems: 'center',
    padding: 2,
    paddingRight: 4,
    paddingLeft: 4,
    marginLeft: 10,
  },
  adminBadgeText: {
    color: colors.DARK,
    fontWeight: '700',
    fontSize: 10,
  },
  messageText: {
    color: colors.LIGHT,
    fontSize: 14,
    lineHeight: 20,
  },
  pressable: {
    marginBottom: 5,
  },
});

export default LiveChatMessagesList;
