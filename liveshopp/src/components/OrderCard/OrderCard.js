import React from 'react';
import {Text, StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import colors from '../../styles/colors';

const OrderCard = ({
  seller_name,
  live_name,
  live_id,
  product_name,
  product_price,
  shipping_address,
  delivery_status,
}) => {
  return (
    <View
      style={{
        width: 350,
        height: 190,
        marginTop: 10,
        marginBottom: 10,
        borderColor: colors.DARK,
        backgroundColor: colors.LIGHT,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 5,
        shadowColor: '#171717',
        shadowOffset: {width: -5, height: 7},
        shadowOpacity: 0.4,
        shadowRadius: 6,
      }}>
      <View style={{margin: 5}}>
        <Text>
          <Text style={{fontWeight: 'bold'}}>Vendeur:</Text> {seller_name}
        </Text>
        <Text style={styles.title}>
          <Text style={{fontWeight: 'bold'}}>Live:</Text> {live_name}
        </Text>
        <Text style={styles.title}>
          <Text style={{fontWeight: 'bold'}}>ID :</Text> {live_id}
        </Text>
      </View>
      <View
        style={{
          margin: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{}}>
          <Text style={styles.title}>
            <Text style={{fontWeight: 'bold'}}>N° ou réf produit :</Text>{' '}
            {product_name}
          </Text>
          <Text style={styles.title}>
            <Text style={{fontWeight: 'bold'}}>Prix de vente :</Text>{' '}
            {product_price} €
          </Text>
        </View>
      </View>
      <View style={{margin: 5, width: 350}}>
        <Text style={styles.title}>
          <Text style={{fontWeight: 'bold'}}>Adresse de livraison :</Text>{' '}
          {shipping_address}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            color:
              delivery_status === 'Expédié' ? colors.SUCCESS : colors.WARNING,
            flexWrap: 'wrap',
          }}>
          <Text style={{fontWeight: 'bold', color: colors.DARK}}>
            Status de la livraison :
          </Text>{' '}
          {delivery_status}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.DARK,
    textAlign: 'left',
    fontSize: 14,
    width: '100%',
  },
});

export default OrderCard;
