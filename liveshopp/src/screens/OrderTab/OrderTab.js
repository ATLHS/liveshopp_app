import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { setInitialOrder } from '../../redux/slices/oderSlice';
import userOrder from '../../services/order';
import colors from '../../styles/colors';
import MyOrder from '../OrderScreen/MyOrder';
import OrderToShipped from '../OrderScreen/OrderToShipped';
import ShippedOrder from '../OrderScreen/ShippedOrder';

const Tab = createMaterialTopTabNavigator();

const OrderTab = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      userOrder
        .getAllOrder()
        .then((res) => res)
        .then((data) => {
          dispatch(setInitialOrder(data.order));
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }, []),
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: colors.DARK },
      }}>
      {user.profil === 'user' ? (
        <>
          <Tab.Screen
            options={{ title: t('myOrders').toUpperCase() }}
            name="MyOrder"
            component={MyOrder}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            options={{ title: t('myGems').toUpperCase() }}
            name="MyOrder"
            component={MyOrder}
          />
          <Tab.Screen
            options={{ title: t('toShip').toUpperCase() }}
            name="Processing"
            component={OrderToShipped}
          />
          <Tab.Screen
            options={{ title: t('shipped').toUpperCase() }}
            name="Shipped"
            component={ShippedOrder}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default OrderTab;
