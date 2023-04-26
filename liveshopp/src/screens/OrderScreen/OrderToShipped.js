import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OrderCard from '../../components/OrderCard/OrderCard';
import colors from '../../styles/colors';
import orderService from '../../services/order';
import Toast from 'react-native-toast-message';
import {setInitialOrder} from '../../redux/slices/oderSlice';
import NoData from '../../components/NoData/NoData';

export const OrderToShipped = () => {
  const {user} = useSelector(state => state.user);
  const {initialOrder} = useSelector(state => state.order);
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const updateOrderStatusHasShipped = () => {
    setIsLoading(true);
    orderService
      .updateOrderStatus(order)
      .then(res => res)
      .then(data => {
        dispatch(setInitialOrder(data.order));
        setIsLoading(false);
        setModalVisible(!modalVisible);
        Toast.show({
          type: 'success',
          text1: data.message,
        });
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          contentInset={{bottom: 100}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.60)',
                  }}>
                  <View
                    style={{
                      height: 230,
                      width: 270,
                      borderRadius: 10,
                      backgroundColor: colors.LIGHT,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 30,
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          textAlign: 'center',
                          fontFamily: 'FugazOne-Regular',
                        }}>
                        CONFIRMER L'ENVOI DE L'ARTICLE :{' '}
                      </Text>
                      <Text style={{fontSize: 18, margin: 5}}>
                        {order.productName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          margin: 5,
                          color: colors.PRIMARY,
                          textAlign: 'center',
                        }}>
                        Attention cette action est définitive
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '100%',
                      }}>
                      <View style={{margin: 10, height: 30}}>
                        <TouchableOpacity
                          style={{
                            height: 40,
                            width: 100,
                            backgroundColor: 'black',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => setModalVisible(!modalVisible)}>
                          <Text
                            style={{
                              color: colors.LIGHT,
                              textAlign: 'center',
                              fontSize: 15,
                            }}>
                            Annulé
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{margin: 10, borderRadius: 10, height: 30}}>
                        <TouchableOpacity
                          style={{
                            height: 40,
                            width: 100,
                            backgroundColor: 'black',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={updateOrderStatusHasShipped}>
                          <Text
                            style={{
                              color: colors.LIGHT,
                              textAlign: 'center',
                              fontSize: 15,
                            }}>
                            Confirmé
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Modal>
              <View style={styles.endedLive}>
                {initialOrder.length &&
                initialOrder.filter(
                  order =>
                    order.seller_id === user.id &&
                    order.deliveryStatut === "En attente d'expédition",
                ).length
                  ? initialOrder
                      .filter(
                        order =>
                          order.seller_id === user.id &&
                          order.deliveryStatut === "En attente d'expédition",
                      )
                      .map((live, id) => (
                        <TouchableOpacity
                          key={id}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                            setOrder(live);
                          }}>
                          <OrderCard
                            seller_name={live.seller.company_name}
                            live_name={live.live_name}
                            live_id={live.auctionId}
                            product_name={live.productName}
                            product_price={live.salePrice}
                            shipping_address={live.shipping_address}
                            delivery_status={live.deliveryStatut}
                          />
                        </TouchableOpacity>
                      ))
                  : ''}
                {!initialOrder.filter(
                  order =>
                    order.seller_id === user.id &&
                    order.deliveryStatut === "En attente d'expédition",
                ).length && (
                  <NoData
                    title={"Vous n'avez aucun article à expédier."}
                    message={
                      'Les articles vendus lors de vos enchères en live et à expédier apparaîtront ici.'
                    }
                  />
                )}
                {isLoading && (
                  <View
                    style={{
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color={colors.DARK} />
                  </View>
                )}
              </View>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
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

export default OrderToShipped;
