import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Theme } from '../../theme/Theme';
import { FileText, Download, ChevronLeft, Receipt, Settings } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import EmptyState from '../../components/EmptyState';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function InvoiceScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailModal, setDetailModal] = useState(false);

  const invoices = {
    purchases: [
      { 
        id: 'HD-0012', 
        title: 'Mua xe Honda CBR150R', 
        date: '10/01/2026', 
        total: '72.000.000đ', 
        status: 'Đã thanh toán',
        items: [
          { name: 'Giá xe (VAT)', price: '70.500.000đ' },
          { name: 'Phí trước bạ', price: '1.200.000đ' },
          { name: 'Phí biển số', price: '300.000đ' }
        ]
      }
    ],
    services: [
      { 
        id: 'HD-10924', 
        title: 'Bảo dưỡng định kỳ 15,000km', 
        date: '08/05/2026', 
        total: '1.250.000đ', 
        status: 'Đã thanh toán',
        items: [
          { name: 'Nhớt động cơ Motul', price: '350.000đ' },
          { name: 'Lọc gió chính hãng', price: '250.000đ' },
          { name: 'Vệ sinh nồi & Kim phun', price: '450.000đ' },
          { name: 'Tiền công thợ', price: '200.000đ' }
        ]
      },
      { 
        id: 'HD-08812', 
        title: 'Thay lốp & Nhớt', 
        date: '15/02/2026', 
        total: '2.100.000đ', 
        status: 'Đã thanh toán',
        items: [
          { name: 'Lốp Pirelli Rosso Sport', price: '1.600.000đ' },
          { name: 'Nhớt Liqui Moly', price: '400.000đ' },
          { name: 'Tiền công thợ', price: '100.000đ' }
        ]
      }
    ]
  };

  const openDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setDetailModal(true);
  };

  const currentData = invoices[activeTab];

  return (
    <View style={styles.container}>
      {/* I.4 HEADER (STRATEGY: TRANSPARENCY) */}
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={Theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hóa đơn & Chi tiêu 🧾</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile', params: { openSettings: true } })}>
          <Settings color={Theme.colors.text} size={24} />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'purchases' && styles.activeTab]} 
          onPress={() => setActiveTab('purchases')}
        >
          <Text style={[styles.tabText, activeTab === 'purchases' && styles.activeTabText]}>Sở hữu xe</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'services' && styles.activeTab]} 
          onPress={() => setActiveTab('services')}
        >
          <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>Dịch vụ & Linh kiện</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {currentData.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInDown.duration(600).delay(index * 100)}>
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.idBadge}>
                  <FileText color={Theme.colors.primary} size={14} />
                  <Text style={styles.idText}>{item.id}</Text>
                </View>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.totalLabel}>Tổng chi phí</Text>
                  <Text style={styles.totalValue}>{item.total}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.detailBtn} onPress={() => openDetail(item)}>
                    <Text style={styles.detailText}>Chi tiết</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.downloadBtn}>
                    <Download color="#fff" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </ScrollView>

      {/* I.4 INVOICE DETAIL MODAL */}
      <Modal visible={detailModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setDetailModal(false)} />
          <Animated.View entering={FadeInDown.duration(400)} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Chi tiết hóa đơn</Text>
            <Text style={styles.modalSub}>{selectedInvoice?.id} • {selectedInvoice?.date}</Text>

            <View style={styles.breakdown}>
              {selectedInvoice?.items.map((it, idx) => (
                <View key={idx} style={styles.breakdownRow}>
                  <Text style={styles.itemName}>{it.name}</Text>
                  <Text style={styles.itemPrice}>{it.price}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalFinalLabel}>TỔNG CỘNG</Text>
                <Text style={styles.totalFinalVal}>{selectedInvoice?.total}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.pdfBtn} onPress={() => setDetailModal(false)}>
              <FileText color="#fff" size={20} />
              <Text style={styles.pdfText}>Tải file PDF hóa đơn</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.md },
  backBtn: { width: 45, height: 45, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { color: Theme.colors.text, fontSize: 22, fontWeight: 'bold' },
  
  tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 25 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Theme.colors.primary },
  tabText: { color: Theme.colors.subtext, fontSize: 14, fontWeight: 'bold' },
  activeTabText: { color: Theme.colors.primary },
  
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { padding: 20, marginBottom: 16 },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  idBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  idText: { color: Theme.colors.primary, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  date: { color: Theme.colors.subtext, fontSize: 12 },
  
  title: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  totalLabel: { color: Theme.colors.subtext, fontSize: 12, marginBottom: 4 },
  totalValue: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  detailBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  detailText: { color: Theme.colors.text, fontSize: 13, fontWeight: 'bold' },
  downloadBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)' },
  modalSheet: { backgroundColor: '#0F172A', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 60 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: 24 },
  modalTitle: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  modalSub: { color: Theme.colors.subtext, fontSize: 14, marginBottom: 30 },

  breakdown: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20, marginBottom: 30 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  itemName: { color: Theme.colors.subtext, fontSize: 14, flex: 1 },
  itemPrice: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 15 },
  totalFinalLabel: { color: Theme.colors.text, fontSize: 16, fontWeight: '900' },
  totalFinalVal: { color: Theme.colors.primary, fontSize: 20, fontWeight: 'bold' },

  pdfBtn: { backgroundColor: Theme.colors.secondary, height: 60, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  pdfText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 12 }
});
