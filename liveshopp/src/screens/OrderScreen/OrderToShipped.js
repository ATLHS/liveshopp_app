import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';

import NoData from '../../components/NoData/NoData';
import OrderCard from '../../components/OrderCard/OrderCard';
import OrderDeliveryStatus from '../../constants/OrderDeliveryStatus';
import { updateInitialOrder } from '../../redux/slices/oderSlice';
import orderService from '../../services/order';
import colors from '../../styles/colors';

const OrderToShipped = () => {
  const { t } = useTranslation();
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
            order.seller_id._id === user.id && order.deliveryStatut === OrderDeliveryStatus.PENDING,
        ).length
      ) {
        setOrder(
          initialOrder.filter(
            (order) =>
              order.seller_id._id === user.id &&
              order.deliveryStatut === OrderDeliveryStatus.PENDING,
          ),
        );
      }
    }, [initialOrder, modalVisible, selectedOrder]),
  );

  const { control, handleSubmit, reset } = useForm({});

  const updateOrderStatusHasShipped = (selectedOrder, data) => {
    setIsLoading(true);
    data.selectedOrder = selectedOrder;
    orderService
      .updateOrderStatus(data)
      .then((res) => res)
      .then((data) => {
        dispatch(updateInitialOrder(data.updatedOrder));
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
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalText}>{t('inputShipmentTracking')}</Text>
                  </View>
                  <View style={styles.modalTextContainer}>
                    <Text style={styles.modalProduct}>{selectedOrder.productName}</Text>
                    <Controller
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: t('trackingUrlErrorMessage'),
                        },
                      }}
                      render={({ field: { onChange }, fieldState: { error } }) => (
                        <>
                          <TextInput
                            style={styles.modalTrackingUrlInput}
                            placeholder={t('trackingUrlLabel')}
                            onChangeText={(value) => onChange(value)}
                            placeholderTextColor={'#707070'}
                          />
                          {error && error.message && (
                            <Text style={styles.error_message}>{error.message}</Text>
                          )}
                        </>
                      )}
                      name="trackingUrl"
                    />
                    <Text style={styles.helperMessage}>{t('trackingUrlHelperMessage')}</Text>
                  </View>
                  <View style={styles.modalContainerButton}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleSubmit((data) =>
                        updateOrderStatusHasShipped(selectedOrder, data),
                      )}>
                      <Text style={styles.modalButtonText}>{t('confirm')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            </Modal>
            <View style={styles.endedLive}>
              {order.length && (
                <OrderCard
                  order={order}
                  setModalVisible={(modalVisible) => {
                    setModalVisible(modalVisible);
                    // reset form validation to clear error
                    reset();
                  }}
                  setSelectedOrder={(order) => setSelectedOrder(order)}
                  modalVisible={modalVisible}
                  enableActionOnOrder={true}
                />
              )}
              {!initialOrder.filter(
                (order) =>
                  order.seller_id._id === user.id &&
                  order.deliveryStatut === OrderDeliveryStatus.PENDING,
              ).length && <NoData title={t('noItemsToShip')} message={t('itemsSoldAndToShip')} />}
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
  error_message: {
    backgroundColor: colors.LIGHT,
    color: colors.PRIMARY,
    marginBottom: 10,
    width: '100%',
  },
  modalContent: {
    position: 'relative',
    width: '80%',
    borderRadius: 10,
    backgroundColor: colors.LIGHT,
    padding: 20,
    marginTop: -250,
  },
  modalTitleContainer: {
    width: '100%',
  },
  modalTextContainer: {
    width: '100%',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.DARK,
  },
  helperMessage: { color: colors.HOUR, fontSize: 13 },
  modalProduct: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.DARK,
  },
  modalTrackingUrlInput: {
    color: colors.DARK,
    fontSize: 13,
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 1)',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  modalAlert: {
    fontSize: 15,
    marginVertical: 5,
    color: colors.PRIMARY,
    textAlign: 'center',
  },
  modalContainerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    height: 40,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 8,
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
