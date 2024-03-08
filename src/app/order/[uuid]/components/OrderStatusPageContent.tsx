'use client';

import { FC, useEffect, useState } from 'react';

import { orders } from '@/api/orders';
import { API } from '@/api/types';
import OrderInfo from '@/components/Orders/OrderInfo';
import { OrderStatuses, defaultUpdateInterval } from '@/constants';

type OrderStatusPageContentProps = {
  order: API.Orders.Status.Response;
  uuid: string;
};

const OrderStatusPageContent: FC<OrderStatusPageContentProps> = ({ uuid, order }) => {
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    const intervalGetOrderInfo =
      currentOrder.status === OrderStatuses.PENDING
        ? setInterval(async () => {
            const { data } = await orders.status.getByUuid(uuid);
            setCurrentOrder(data);
          }, defaultUpdateInterval)
        : undefined;

    return () => clearInterval(intervalGetOrderInfo);
  }, [currentOrder]);

  return <OrderInfo order={currentOrder} />;
};

export default OrderStatusPageContent;
