import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { faLocationDot, faStore, faTruck, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import colors from '../../styles/colors';

const OrderCard = ({
  order,
  setModalVisible,
  setSelectedOrder,
  modalVisible,
  enableActionOnOrder,
}) => {
  const deliveryStatutIcon = (deliveryStatus) => {
    return deliveryStatus === "En attente d'expédition" ? faTruck : faTruckFast;
  };
  return (
    <FlatList
      contentContainerStyle={{
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      contentInset={{ bottom: 100 }}
      data={order}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            if (enableActionOnOrder) {
              setSelectedOrder(item);
              setModalVisible(!modalVisible);
            }
          }}>
          <View
            style={{
              flex: 1,
              width: 370,
              borderRadius: 6,
              borderStyle: 'solid',
              borderWidth: 0,
              marginBottom: 10,
              marginTop: 12,
              borderColor: colors.DARK,
              position: 'relative',
              backgroundColor: '#F4F4F4',
              flexBasis: 'auto',
              padding: 15,
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '800',
                    }}>
                    {item.productName}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '800',
                    }}>
                    {item.salePrice}€
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '800',
                    }}>
                    Réf :{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                    }}>
                    {item.auctionId}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginBottom: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <FontAwesomeIcon icon={faStore} size={15} />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 5,
                    }}>
                    {item.seller.company_name}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <FontAwesomeIcon icon={faLocationDot} size={15} />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 5,
                    }}>
                    {item.shipping_address}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                  }}>
                  <FontAwesomeIcon
                    icon={deliveryStatutIcon(item.deliveryStatut)}
                    size={15}
                    style={{ marginBottom: 0 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 5,
                      height: 16,
                    }}>
                    {item.deliveryStatut}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.DARK,
    textAlign: 'left',
    fontSize: 12,
    marginBottom: 5,
    width: '100%',
    flexDirection: 'row',
  },
});

export default OrderCard;
