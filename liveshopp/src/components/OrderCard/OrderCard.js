import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  faLink,
  faLocationDot,
  faRoute,
  faStore,
  faTruck,
  faTruckFast,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import OrderDeliveryStatus from '../../constants/OrderDeliveryStatus';
import user from '../../services/user';
import colors from '../../styles/colors';

const OrderCard = ({
  order,
  setModalVisible,
  setSelectedOrder,
  modalVisible,
  enableActionOnOrder,
}) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const deliveryStatutIcon = (deliveryStatus) => {
    return deliveryStatus === OrderDeliveryStatus.PENDING ? faTruck : faTruckFast;
  };

  return (
    <FlatList
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
          <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <View style={styles.header}>
                <View style={styles.row}>
                  <Text style={styles.productName}>{item.productName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.salePrice}>{item.salePrice}€</Text>
                </View>
              </View>
              <View style={styles.refContainer}>
                <View style={styles.row}>
                  <Text style={styles.refLabel}>{t('ref')} : </Text>
                  <Text style={styles.refValue}>{item.auctionId}</Text>
                </View>
              </View>
              <View style={styles.sellerContainer}>
                <View style={styles.rowWithIcon}>
                  <FontAwesomeIcon icon={faStore} size={15} />
                  <Text style={styles.sellerName}>
                    {item.seller_id && item.seller_id.company_name}
                  </Text>
                </View>
              </View>
              <View style={styles.userContainer}>
                <View style={styles.rowWithIcon}>
                  <FontAwesomeIcon icon={faUser} size={15} />
                  <Text style={styles.userName}>
                    {`${item.userId.firstname} ${item.userId.lastname}`}
                  </Text>
                </View>
              </View>
              <View style={styles.addressContainer}>
                <View style={styles.rowWithIcon}>
                  <FontAwesomeIcon icon={faLocationDot} size={15} />
                  <Text style={styles.address}>{item.shipping_address}</Text>
                </View>
              </View>

              <View style={styles.statusContainer}>
                <View style={styles.rowWithIcon}>
                  <FontAwesomeIcon
                    icon={deliveryStatutIcon(item.deliveryStatut)}
                    size={15}
                    color={
                      item.deliveryStatut === OrderDeliveryStatus.PENDING
                        ? colors.HOUR
                        : colors.SUCCESS
                    }
                  />
                  <Text style={styles.deliveryStatus}>
                    {item.deliveryStatut === OrderDeliveryStatus.PENDING
                      ? t('pending')
                      : t('shipped')}
                  </Text>
                </View>
              </View>

              {item.trackingUrl && (
                <View style={styles.trackingContainer}>
                  <View style={styles.rowWithIcon}>
                    <FontAwesomeIcon icon={faRoute} size={15} />
                    <Pressable onPress={() => Linking.openURL(item.trackingUrl)}>
                      <Text style={styles.trackingUrl}>
                        {user.profil === 'seller' ? t('trackingUrlLabel') : t('trackOrderButton')}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
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
  cardContainer: {
    flex: 1,
    width: '100%',
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
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  productName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.DARK,
  },
  salePrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.DARK,
  },
  refContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  refLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.DARK,
  },
  refValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.DARK,
  },
  sellerContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  rowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 5,
    color: colors.DARK,
  },
  userContainer: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  userName: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 5,
    color: colors.DARK,
  },
  addressContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  address: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 5,
    color: colors.DARK,
  },
  statusContainer: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  deliveryStatus: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 5,
    color: colors.DARK,
  },
  trackingContainer: {
    flexDirection: 'column',
  },
  trackingUrl: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 5,
    color: colors.DARK,
  },
});

export default OrderCard;
