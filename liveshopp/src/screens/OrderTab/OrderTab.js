import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {setInitialOrder} from '../../redux/slices/oderSlice';
import MyOrder from '../OrderScreen/MyOrder';
import OrderToShipped from '../OrderScreen/OrderToShipped';
import ShippedOrder from '../OrderScreen/ShippedOrder';
import {useFocusEffect} from '@react-navigation/native';
import userOrder from '../../services/order';

const Tab = createMaterialTopTabNavigator();

const OrderTab = () => {
    const {user} = useSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
            userOrder
                .getAllOrder()
                .then(res => res)
                .then(data => {
                    dispatch(setInitialOrder(data.order));
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }, []),
    );

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {backgroundColor: colors.DARK},
            }}>
            {user.profil === 'user' ? (
                <>
                    <Tab.Screen
                        options={{title: 'MES COMMANDES'}}
                        name="MyOrder"
                        component={MyOrder}
                    />
                </>
            ) : (
                <>
                    <Tab.Screen
                        options={{title: 'Mes pépites'}}
                        name="MyOrder"
                        component={MyOrder}
                    />
                    <Tab.Screen
                        options={{title: 'À expédier'}}
                        name="Processing"
                        component={OrderToShipped}
                    />
                    <Tab.Screen
                        options={{title: 'Expédié'}}
                        name="Shipped"
                        component={ShippedOrder}
                    />
                </>
            )}
        </Tab.Navigator>
    );
};

export default OrderTab;
