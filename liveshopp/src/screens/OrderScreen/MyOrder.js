import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';

import NoData from '../../components/NoData/NoData';
import OrderCard from '../../components/OrderCard/OrderCard';
import colors from '../../styles/colors';

export const MyOrder = () => {
  const { t } = useTranslation();
  const { initialOrder } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const [order, setOrder] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (
        initialOrder.length &&
        initialOrder.filter((order) => order.userId._id === user.id).length
      ) {
        setOrder(initialOrder.filter((order) => order.userId._id === user.id));
      }
    }, [initialOrder]),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.endedLive}>
          {order.length ? (
            <OrderCard
              order={order}
              setModalVisible={null}
              setSelectedOrder={null}
              modalVisible={null}
              enableActionOnOrder={false}
            />
          ) : (
            ''
          )}
          {!initialOrder.filter((order) => order.userId._id === user.id).length && (
            <NoData title={t('noGems')} message={t('wonAuctionItems')} />
          )}
        </View>
        {/*</ScrollView>*/}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  endedLive: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: 10,
  },
});

export default MyOrder;
