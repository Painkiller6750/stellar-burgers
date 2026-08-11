import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderData,
  fetchOrderByNumber
} from '../../services/slices/orders-slice';

interface OrderInfoProps {
  orderNumber?: string;
}

export const OrderInfo: FC<OrderInfoProps> = ({ orderNumber }) => {
  const dispatch = useDispatch();

  // Если номер пришёл через проп (из App), используем его, иначе читаем из params
  // Это нужно, чтобы работало и при открытии модалки (где params может быть не тем, что ожидает логика)
  const urlParams = useParams<{ number?: string }>();
  const number = orderNumber ?? urlParams.number;

  const { orderData, isLoading } = useSelector((state) => state.orders);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (number) dispatch(fetchOrderByNumber(Number(number)));
    return () => {
      dispatch(clearOrderData());
    };
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (!ingredient) return acc;

        if (!acc[item]) acc[item] = { ...ingredient, count: 1 };
        else acc[item].count += 1;
        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date: new Date(orderData.createdAt),
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} orderNumber={number} />;
};
