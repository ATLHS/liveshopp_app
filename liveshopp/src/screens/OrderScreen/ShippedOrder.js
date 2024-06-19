import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';

import NoData from '../../components/NoData/NoData';
import OrderCard from '../../components/OrderCard/OrderCard';
import colors from '../../styles/colors';

export const ShippedOrder = () => {
  const { t } = useTranslation();
  const { initialOrder } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      if (
        initialOrder.filter(
          (order) => order.seller_id._id === user.id && order.deliveryStatut === 'Expédié',
        ).length
      ) {
        setOrder(
          initialOrder.filter(
            (order) => order.seller_id._id === user.id && order.deliveryStatut === 'Expédié',
          ),
        );
      }
    }, [initialOrder]),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View style={styles.endedLive}>
              {order.length && (
                <OrderCard
                  order={order}
                  setModalVisible={null}
                  setSelectedOrder={null}
                  modalVisible={null}
                  enableActionOnOrder={false}
                />
              )}
              {!initialOrder.filter(
                (order) => order.seller_id._id === user.id && order.deliveryStatut === 'Expédié',
              ).length && <NoData title={t('noItemsShipped')} message={t('shippedItemsInfo')} />}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.DARK} />
                </View>
              )}
            </View>
          </>
        </TouchableWithoutFeedback>
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

export default ShippedOrder;
