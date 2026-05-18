import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Theme, useActiveColors } from '../theme/Theme';
import { Check, X, Info, FileText } from 'lucide-react-native';
import GlassCard from './GlassCard';

const RemoteApproval = ({ items: initialItems, onComplete }) => {
  const activeColors = useActiveColors();
  const [items, setItems] = useState(initialItems || [
    { id: '1', name: 'Nhớt máy Castrol Power1', price: 450000, status: 'pending', urgent: true },
    { id: '2', name: 'Lọc nhớt chính hãng', price: 150000, status: 'pending', urgent: true },
    { id: '3', name: 'Vệ sinh sên (xích)', price: 100000, status: 'pending', urgent: false },
    { id: '4', name: 'Thay má phanh sau', price: 550000, status: 'pending', urgent: false },
  ]);

  const toggleStatus = (id, status) => {
    setItems(items.map(item => item.id === id ? { ...item, status } : item));
  };

  const calculateTotal = () => {
    return items
      .filter(item => item.status === 'approved')
      .reduce((sum, item) => sum + item.price, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FileText color={activeColors.primary} size={20} />
        <Text style={[styles.title, { color: activeColors.text }]}>Báo giá & Phê duyệt 📝</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {items.map(item => (
          <GlassCard key={item.id} style={styles.itemCard} intensity={item.status === 'rejected' ? 5 : 15}>
            <View style={styles.itemInfo}>
              <View style={styles.itemNameRow}>
                <Text style={[styles.itemName, { color: activeColors.text }, item.status === 'rejected' && [styles.rejectedText, { color: activeColors.subtext }]]}>{item.name}</Text>
                {item.urgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={[styles.urgentText, { color: activeColors.secondary }]}>CẦN THIẾT</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.itemPrice, { color: activeColors.primary }]}>{formatCurrency(item.price)}</Text>
            </View>
            
            <View style={[styles.actionRow, { borderTopColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
              <TouchableOpacity 
                style={[styles.actionBtn, item.status === 'rejected' && [styles.activeReject, { backgroundColor: activeColors.secondary }]]} 
                onPress={() => toggleStatus(item.id, 'rejected')}
              >
                <X color={item.status === 'rejected' ? '#fff' : activeColors.subtext} size={18} />
                <Text style={[styles.actionText, { color: activeColors.subtext }, item.status === 'rejected' && styles.activeLabel]}>Từ chối</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, item.status === 'approved' && [styles.activeApprove, { backgroundColor: activeColors.success }]]} 
                onPress={() => toggleStatus(item.id, 'approved')}
              >
                <Check color={item.status === 'approved' ? '#fff' : activeColors.subtext} size={18} />
                <Text style={[styles.actionText, { color: activeColors.subtext }, item.status === 'approved' && styles.activeLabel]}>Đồng ý</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: activeColors.subtext }]}>Tổng cộng dự tính:</Text>
          <Text style={[styles.totalValue, { color: activeColors.text }]}>{formatCurrency(calculateTotal())}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: activeColors.primary }]}
          onPress={() => onComplete?.(items)}
        >
          <Text style={styles.submitText}>Xác nhận tất cả</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  scroll: { flex: 1 },
  itemCard: { padding: 15, marginBottom: 12 },
  itemInfo: { marginBottom: 15 },
  itemNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  itemName: { color: '#fff', fontSize: 15, fontWeight: 'bold', flex: 1 },
  rejectedText: { color: Theme.colors.subtext, textDecorationLine: 'line-through' },
  itemPrice: { color: Theme.colors.primary, fontSize: 14, fontWeight: '600' },
  urgentBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginLeft: 10 },
  urgentText: { color: Theme.colors.secondary, fontSize: 8, fontWeight: '900' },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 10 },
  activeApprove: { backgroundColor: Theme.colors.success },
  activeReject: { backgroundColor: Theme.colors.secondary },
  actionText: { color: Theme.colors.subtext, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  activeLabel: { color: '#fff' },
  footer: { marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { color: Theme.colors.subtext, fontSize: 14 },
  totalValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  submitBtn: { backgroundColor: Theme.colors.primary, height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default RemoteApproval;
