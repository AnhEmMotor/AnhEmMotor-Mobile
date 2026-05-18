import { useState, useEffect, useCallback } from 'react';
import { useDependency } from '../../../di/DependencyContext';


export function useOrderController() {
  const { getOrdersUseCase } = useDependency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getOrdersUseCase.execute();
      setOrders(list);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openOrderLogisticsSheet = (order) => {
    setSelectedOrder(order);
    setSheetVisible(true);
  };

  const closeOrderLogisticsSheet = () => {
    setSheetVisible(false);
    setSelectedOrder(null);
  };

  return {
    orders,
    loading,
    selectedOrder,
    sheetVisible,
    refreshOrders: loadOrders,
    openLogistics: openOrderLogisticsSheet,
    closeLogistics: closeOrderLogisticsSheet,
  };
}
