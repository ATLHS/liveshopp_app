import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import OrderCard from '../../components/OrderCard/OrderCard';
import NoData from '../../components/NoData/NoData';
import colors from '../../styles/colors';

export const OrderToShipped = () => {
    const {initialOrder} = useSelector(state => state.order);
    const {user} = useSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(false);

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
                            <View style={styles.endedLive}>
                                {initialOrder.length &&
                                initialOrder.filter(
                                    order =>
                                        order.seller_id === user.id &&
                                        order.deliveryStatut === 'Expédié',
                                ).length
                                    ? initialOrder
                                        .filter(
                                            order =>
                                                order.seller_id === user.id &&
                                                order.deliveryStatut === 'Expédié',
                                        )
                                        .map((live, id) => (
                                            <TouchableOpacity
                                                key={id}>
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
                                        order.deliveryStatut === 'Expédié',
                                ).length && (
                                    <NoData
                                        title={"Vous n'avez aucun article expédier."}
                                        message={
                                            'Les articles vendus lors de vos enchères en live et qui on été expédier apparaîtront ici.'
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
                                        <ActivityIndicator size="large" color={colors.DARK}/>
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
