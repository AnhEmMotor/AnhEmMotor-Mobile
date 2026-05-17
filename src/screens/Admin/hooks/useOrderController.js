import { useState, useEffect, useCallback } from 'react';
import { MockAdminDataSource } from '../../../data/admin/datasources/MockAdminDataSource';
import { AdminRepositoryImpl } from '../../../data/admin/repositories/AdminRepositoryImpl';
import { GetOrders } from '../../../domain/admin/usecases/GetOrders';

const dataSource = new MockAdminDataSource();
const repository = new AdminRepositoryImpl(dataSource);
const getOrdersUseCase = new GetOrders(repository);

export function useOrderController() {
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
