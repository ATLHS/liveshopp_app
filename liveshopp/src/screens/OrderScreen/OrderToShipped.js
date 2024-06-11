import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';

import NoData from '../../components/NoData/NoData';
import OrderCard from '../../components/OrderCard/OrderCard';
import { setInitialOrder } from '../../redux/slices/oderSlice';
import orderService from '../../services/order';
import colors from '../../styles/colors';

const OrderToShipped = () => {
  const { user } = useSelector((state) => state.user);
  const { initialOrder } = useSelector((state) => state.order);
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      if (
        initialOrder.filter(
          (order) =>
            (order.seller_id || order.seller._id) === user.id &&
            order.deliveryStatut === "En attente d'expédition",
        ).length
      ) {
        setOrder(
          initialOrder.filter(
            (order) =>
              (order.seller_id || order.seller._id) === user.id &&
              order.deliveryStatut === "En attente d'expédition",
          ),
        );
      }
    }, [initialOrder, modalVisible, selectedOrder]),
  );

  const updateOrderStatusHasShipped = (selectedOrder) => {
    setIsLoading(true);
    orderService
      .updateOrderStatus(selectedOrder)
      .then((res) => res)
      .then((data) => {
        dispatch(setInitialOrder(data.order));
        setIsLoading(false);
        setModalVisible(!modalVisible);
        Toast.show({
          type: 'toastSuccess',
          text1: data.message,
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Modal animationType="fade" transparent={true} visible={modalVisible}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <View style={styles.modalTextContainer}>
                    <Text style={styles.modalText}>CONFIRMER L'ENVOI DE L'ARTICLE : </Text>
                    <Text style={styles.modalProduct}>{selectedOrder.productName}</Text>
                    <Text style={styles.modalAlert}>Attention cette action est définitive</Text>
                  </View>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.modalButtonText}>Annulé</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => updateOrderStatusHasShipped(selectedOrder)}>
                      <Text style={styles.modalButtonText}>Confirmé</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            </Modal>
            <View style={styles.endedLive}>
              {order.length && (
                <OrderCard
                  order={order}
                  setModalVisible={(modalVisible) => setModalVisible(modalVisible)}
                  setSelectedOrder={(order) => setSelectedOrder(order)}
                  modalVisible={modalVisible}
                  enableActionOnOrder={true}
                />
              )}
              {!initialOrder.filter(
                (order) =>
                  (order.seller_id || order.seller._id) === user.id &&
                  order.deliveryStatut === "En attente d'expédition",
              ).length && (
                <NoData
                  title={"Vous n'avez aucun article à expédier."}
                  message={
                    'Les articles vendus lors de vos enchères et à expédier apparaîtront ici.'
                  }
                />
              )}
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
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  modalContent: {
    height: 230,
    width: 270,
    borderRadius: 10,
    backgroundColor: colors.LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'FugazOne-Regular',
  },
  modalProduct: {
    fontSize: 18,
    marginVertical: 5,
  },
  modalAlert: {
    fontSize: 15,
    marginVertical: 5,
    color: colors.PRIMARY,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    height: 40,
    width: 100,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: colors.LIGHT,
    textAlign: 'center',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderToShipped;
