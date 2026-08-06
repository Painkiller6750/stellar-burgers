import { useEffect, FC } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/orders-slice';

export const ProfileOrders: FC = () => {
    const dispatch = useDispatch();

    const { orders, isLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    // Show preloader only when loading and there are no orders yet
    if (isLoading && !orders.length) {
        return <Preloader />;
    }

    return <ProfileOrdersUI orders={orders} />;
};
