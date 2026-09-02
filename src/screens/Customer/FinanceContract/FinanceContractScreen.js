import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  FileCheck2,
  Building2,
  Banknote,
  CalendarDays,
  Car,
  Shield,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Fingerprint,
  Hash,
} from 'lucide-react-native';
import { useActiveColors } from '../../../theme/Theme';
import { getMyFinanceContractsApi } from '../../../api/customerApi';

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ';

const STATUS_MAP = {
  Signed: { label: 'Đã ký kết', color: '#10B981', icon: CheckCircle2 },
  PendingApproval: { label: 'Chờ duyệt', color: '#F59E0B', icon: Clock },
  Approved: { label: 'Đã phê duyệt', color: '#3B82F6', icon: CheckCircle2 },
  Cancelled: { label: 'Đã huỷ', color: '#EF4444', icon: AlertCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? { label: status, color: '#94A3B8', icon: Clock };
  const Icon = cfg.icon;
  return (
    <View
      style={[badge.wrap, { backgroundColor: cfg.color + '1A', borderColor: cfg.color + '40' }]}
    >
      <Icon size={12} color={cfg.color} />
      <Text style={[badge.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}
const badge = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: { fontSize: 11, fontWeight: '700' },
});

function InfoRow({ icon: Icon, label, value, valueColor, colors }) {
  if (!value) return null;
  return (
    <View style={[row.container, { borderBottomColor: colors.border }]}>
      <View style={row.left}>
        <Icon size={15} color={colors.subtext} />
        <Text style={[row.label, { color: colors.subtext }]}>{label}</Text>
      </View>
      <Text style={[row.value, { color: valueColor ?? colors.text }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}
const row = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: '600', maxWidth: '50%', textAlign: 'right' },
});

export default function FinanceContractScreen({ navigation }) {
  const colors = useActiveColors();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyFinanceContractsApi();
        setContracts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView
      style={[s.root, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      {}
      <View style={[s.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Hợp đồng mua xe</Text>
        <View style={{ width: 40 }} />
      </View>

      {}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.hint, { color: colors.subtext }]}>Đang tải hợp đồng...</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <AlertCircle size={48} color={colors.subtext} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>Không thể tải dữ liệu</Text>
          <Text style={[s.hint, { color: colors.subtext }]}>{error}</Text>
        </View>
      ) : contracts.length === 0 ? (
        <View style={s.center}>
          <FileCheck2 size={60} color={colors.subtext} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>Chưa có hợp đồng</Text>
          <Text style={[s.hint, { color: colors.subtext }]}>
            Bạn chưa có hợp đồng mua xe nào với AnhEmMotor.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        >
          <Text style={[s.sectionLabel, { color: colors.subtext }]}>
            {contracts.length} hợp đồng tìm thấy
          </Text>

          {contracts.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setSelected(c)}
              activeOpacity={0.85}
              style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              {}
              <View style={s.cardTop}>
                <View style={[s.iconWrap, { backgroundColor: '#10B98115' }]}>
                  <Car size={22} color="#10B981" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[s.contractNum, { color: colors.text }]}>{c.contractNumber}</Text>
                  <Text style={[s.vehicleName, { color: colors.subtext }]} numberOfLines={1}>
                    {c.vehicleModel} {c.vehicleColor ? `· ${c.vehicleColor}` : ''}
                  </Text>
                </View>
                <StatusBadge status={c.status} />
              </View>

              <View style={[s.divider, { backgroundColor: colors.border }]} />

              <View style={s.cardNumbers}>
                <View style={s.numBlock}>
                  <Text style={[s.numLabel, { color: colors.subtext }]}>Giá xe</Text>
                  <Text style={[s.numValue, { color: colors.text }]}>{fmt(c.actualSalePrice)}</Text>
                </View>
                <View style={[s.numDivider, { backgroundColor: colors.border }]} />
                <View style={s.numBlock}>
                  <Text style={[s.numLabel, { color: colors.subtext }]}>Đặt cọc</Text>
                  <Text style={[s.numValue, { color: '#F59E0B' }]}>{fmt(c.depositAmount)}</Text>
                </View>
                <View style={[s.numDivider, { backgroundColor: colors.border }]} />
                <View style={s.numBlock}>
                  <Text style={[s.numLabel, { color: colors.subtext }]}>Còn lại</Text>
                  <Text style={[s.numValue, { color: '#EF4444' }]}>{fmt(c.remainingAmount)}</Text>
                </View>
              </View>

              {}
              <View style={[s.cardFooter, { borderTopColor: colors.border }]}>
                <Text style={[s.footerDate, { color: colors.subtext }]}>
                  Ngày ký: {c.signedDate ?? '—'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[s.detailLink, { color: '#10B981' }]}>Xem chi tiết</Text>
                  <ChevronRight size={14} color="#10B981" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={[s.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => setSelected(null)}
            activeOpacity={1}
          />
          <View style={[s.modalSheet, { backgroundColor: colors.sheetBg }]}>
            <View style={[s.handle, { backgroundColor: colors.border }]} />
            <Text style={[s.modalTitle, { color: colors.text }]}>Chi tiết hợp đồng</Text>
            <Text style={[s.modalSub, { color: colors.subtext }]}>
              {selected?.contractNumber} · {selected?.signedDate}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <Text style={[s.groupTitle, { color: colors.subtext }]}>🚗 THÔNG TIN XE</Text>
              <View style={[s.group, { borderColor: colors.border }]}>
                <InfoRow
                  icon={Car}
                  label="Dòng xe"
                  value={selected?.vehicleModel}
                  colors={colors}
                />
                <InfoRow
                  icon={Car}
                  label="Phiên bản"
                  value={selected?.vehicleVersion}
                  colors={colors}
                />
                <InfoRow
                  icon={Car}
                  label="Màu sắc"
                  value={selected?.vehicleColor}
                  colors={colors}
                />
                <InfoRow
                  icon={Hash}
                  label="Số khung"
                  value={selected?.frameNumber}
                  colors={colors}
                />
                <InfoRow
                  icon={Hash}
                  label="Số máy"
                  value={selected?.engineNumber}
                  colors={colors}
                />
              </View>

              <Text style={[s.groupTitle, { color: colors.subtext, marginTop: 16 }]}>
                💰 TÀI CHÍNH
              </Text>
              <View style={[s.group, { borderColor: colors.border }]}>
                <InfoRow
                  icon={Banknote}
                  label="Giá bán thực tế"
                  value={fmt(selected?.actualSalePrice)}
                  valueColor="#A855F7"
                  colors={colors}
                />
                <InfoRow
                  icon={Banknote}
                  label="Tiền đặt cọc"
                  value={fmt(selected?.depositAmount)}
                  valueColor="#F59E0B"
                  colors={colors}
                />
                <InfoRow
                  icon={Banknote}
                  label="Còn phải trả"
                  value={fmt(selected?.remainingAmount)}
                  valueColor="#EF4444"
                  colors={colors}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Hạn thanh toán"
                  value={selected?.finalPaymentDeadline}
                  colors={colors}
                />
              </View>

              <Text style={[s.groupTitle, { color: colors.subtext, marginTop: 16 }]}>
                🛡️ BẢO HÀNH
              </Text>
              <View style={[s.group, { borderColor: colors.border }]}>
                <InfoRow
                  icon={Shield}
                  label="Thời hạn BH"
                  value={selected?.warrantyPeriod}
                  colors={colors}
                />
                <InfoRow
                  icon={Shield}
                  label="Phạm vi BH"
                  value={selected?.warrantyScope}
                  colors={colors}
                />
              </View>

              <Text style={[s.groupTitle, { color: colors.subtext, marginTop: 16 }]}>
                🏢 ĐẠI LÝ
              </Text>
              <View style={[s.group, { borderColor: colors.border }]}>
                <InfoRow
                  icon={Building2}
                  label="Đại lý"
                  value={selected?.showroomName}
                  colors={colors}
                />
                <InfoRow
                  icon={MapPin}
                  label="Địa chỉ"
                  value={selected?.showroomAddress}
                  colors={colors}
                />
                <InfoRow
                  icon={Fingerprint}
                  label="Đại diện"
                  value={selected?.showroomRepresentative}
                  colors={colors}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[s.closeBtn, { borderColor: colors.border, marginTop: 16 }]}
              onPress={() => setSelected(null)}
            >
              <Text style={[s.closeBtnText, { color: colors.subtext }]}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 17, fontWeight: '700' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 12 },
  hint: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginTop: 4 },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },

  list: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11,
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  card: { borderRadius: 20, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contractNum: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  vehicleName: { fontSize: 12 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },
  cardNumbers: { flexDirection: 'row', paddingVertical: 14 },
  numBlock: { flex: 1, alignItems: 'center' },
  numLabel: { fontSize: 10, marginBottom: 4 },
  numValue: { fontSize: 13, fontWeight: '700' },
  numDivider: { width: StyleSheet.hairlineWidth },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerDate: { fontSize: 12 },
  detailLink: { fontSize: 13, fontWeight: '600' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  modalSub: { fontSize: 12, marginBottom: 16 },

  groupTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  group: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, marginBottom: 4 },

  closeBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
