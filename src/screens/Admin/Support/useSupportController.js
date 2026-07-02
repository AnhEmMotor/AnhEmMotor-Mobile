/**
 * @file useSupportController.js
 * @layer Presentation - Controllers / Hooks
 * @description Hook that binds Support & Complaints Resolution Center UI interactions with Clean Architecture Use Cases.
 */
import { useState, useEffect, useCallback } from 'react';
import { useDependency } from '../../../di/DependencyContext';


export function useSupportController() {
  const {
    getSupportTicketsUseCase,
    assignStaffUseCase,
    respondToTicketUseCase,
    resolveTicketUseCase,
    adminRepository: repository,
  } = useDependency();
  const [tickets, setTickets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'handled'

  const loadSupportData = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketList, staffList] = await Promise.all([
        getSupportTicketsUseCase.execute(),
        repository.getSalesStaff() // reusing existing endpoint for personnel list
      ]);
      setTickets(ticketList);
      setStaff(staffList);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu hỗ trợ & khiếu nại:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupportData();
  }, [loadSupportData]);

  const handleAssignStaff = async (ticketId, staffId, staffName) => {
    try {
      const updated = await assignStaffUseCase.execute(ticketId, staffId, staffName);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      return updated;
    } catch (error) {
      console.error("Lỗi khi gán nhân viên xử lý khiếu nại:", error);
      throw error;
    }
  };

  const handleRespondToTicket = async (ticketId, replyText) => {
    try {
      const updated = await respondToTicketUseCase.execute(ticketId, replyText);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      return updated;
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi khiếu nại:", error);
      throw error;
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      const updated = await resolveTicketUseCase.execute(ticketId);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      return updated;
    } catch (error) {
      console.error("Lỗi khi phê duyệt đóng ticket khiếu nại:", error);
      throw error;
    }
  };

  // Filter logic: 'pending' = status: new, assigned, replied. 'handled' = status: resolved
  const getFilteredTickets = () => {
    if (activeTab === 'pending') {
      return tickets.filter(t => t.status !== 'resolved');
    } else {
      return tickets.filter(t => t.status === 'resolved');
    }
  };

  const getPendingCount = () => {
    return tickets.filter(t => t.status !== 'resolved').length;
  };

  return {
    tickets: getFilteredTickets(),
    allTickets: tickets,
    pendingCount: getPendingCount(),
    staff,
    loading,
    activeTab,
    setActiveTab,
    assignStaff: handleAssignStaff,
    respondToTicket: handleRespondToTicket,
    resolveTicket: handleResolveTicket,
    refreshTickets: loadSupportData,
  };
}
