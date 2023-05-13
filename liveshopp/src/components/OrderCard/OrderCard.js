import React from 'react';
import {Text, StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import colors from '../../styles/colors';
import {faEllipsis, faTruckFast, faTruckRampBox} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

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
                height: 230,
                marginTop: 10,
                marginBottom: 10,
                borderRadius: 8,
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'black',
                alignItems: 'flex-start',
                padding: 15,
                backgroundColor: colors.LIGHT
            }}>
            <View style={{margin: 5, width: 350}}>
                <View style={{margin: 5}}>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 12}}>Vendeur : </Text><Text
                        style={{fontSize: 12}}>{seller_name}</Text>
                    </View>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 12}}>Nom du live : </Text>
                        <Text style={{fontSize: 12}}>
                            {live_name}
                        </Text>
                    </View>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 12}}>Identifiant du live : </Text>
                        <Text style={{fontSize: 12}}>
                            {live_id}
                        </Text>
                    </View>
                </View>
                <View style={{margin: 5}}>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 12}}>Article : </Text>
                        <Text style={{fontSize: 12}}>
                            {product_name}
                        </Text>
                    </View>
                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold', fontSize: 12}}>Prix de vente : </Text>
                        <Text style={{fontSize: 12}}>
                            {product_price} €
                        </Text>
                    </View>
                    <View style={{
                        color: colors.DARK,
                        textAlign: 'left',
                        fontSize: 12,
                        marginBottom: 10,
                        width: '100%',
                    }}>
                        <Text style={{fontWeight: 'bold', fontSize: 12}}>Adresse de livraison : </Text>
                        <Text style={{fontSize: 12}}>
                            {shipping_address}
                        </Text>
                    </View>
                </View>
                <View style={{margin: 5}}>
                    <View style={{
                        height: 30,
                        width: delivery_status === 'Expédié' ? 100 : 200,
                        backgroundColor: delivery_status === 'Expédié' ? colors.SUCCESS : colors.PRIMARY,
                        borderRadius: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Text style={{color: colors.LIGHT, fontSize: 13, marginRight: 10}}>{delivery_status}</Text>
                        {delivery_status === 'Expédié' ? <FontAwesomeIcon
                            icon={faTruckFast}
                            color={colors.LIGHT}
                            size={20}

                        /> : <FontAwesomeIcon
                            icon={faTruckRampBox}
                            color={colors.LIGHT}
                            size={20}

                        />}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        color: colors.DARK,
        textAlign: 'left',
        fontSize: 12,
        marginBottom: 5,
        width: '100%',
        flexDirection: 'row'
    },
});

export default OrderCard;
