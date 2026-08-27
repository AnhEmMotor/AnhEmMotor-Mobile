import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Wrench,
  XCircle,
  MessageSquare,
} from 'lucide-react-native';
import { useActiveColors } from '../../../theme/Theme';
import { useAppointmentBooking } from './useAppointmentBooking';
import Toast from '../../../components/Toast';

export default function AppointmentBookingScreen({ navigation }) {
  const activeColors = useActiveColors();
  const toastRef = useRef(null);

  const {
    viewMode,
    setViewMode,
    appointments,
    isFetching,
    fetchAppointments,
    formData,
    updateField,
    isLoading,
    handleSubmit,
    handleCancelAppointment,
    serviceOptions,
    mapStatusLabel,
  } = useAppointmentBooking(navigation, toastRef);

  const blockBg = { backgroundColor: activeColors.cardBg, borderColor: activeColors.border };

  const renderListView = () => (
    <View style={{ flex: 1 }}>
      {}
      <View
        style={[
          styles.header,
          { borderBottomColor: activeColors.border, backgroundColor: activeColors.cardBg },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Lịch Hẹn Của Tôi</Text>
        <TouchableOpacity
          onPress={() => setViewMode('create')}
          style={[styles.headerActionBtn, { backgroundColor: activeColors.primary }]}
        >
          <Plus color="#fff" size={18} />
          <Text style={styles.headerActionBtnText}>Tạo mới</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={fetchAppointments}
            tintColor={activeColors.primary}
            colors={[activeColors.primary]}
          />
        }
      >
        <Text style={[styles.sectionHeading, { color: activeColors.text }]}>
          Danh sách lịch hẹn ({appointments.length})
        </Text>

        {isFetching && appointments.length === 0 ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={activeColors.primary} />
            <Text style={[styles.loadingText, { color: activeColors.subtext }]}>
              Đang tải danh sách lịch hẹn...
            </Text>
          </View>
        ) : appointments.length === 0 ? (
          <View
            style={[
              styles.emptyBox,
              { backgroundColor: activeColors.cardBg, borderColor: activeColors.border },
            ]}
          >
            <Clock size={44} color={activeColors.subtext} style={{ opacity: 0.6 }} />
            <Text style={[styles.emptyTitle, { color: activeColors.text }]}>
              Chưa có lịch hẹn nào
            </Text>
            <Text style={[styles.emptySubtitle, { color: activeColors.subtext }]}>
              Bạn chưa đăng ký lịch hẹn dịch vụ nào. Hãy tạo lịch hẹn để được phục vụ tốt nhất.
            </Text>
            <TouchableOpacity
              style={[styles.emptyCreateBtn, { backgroundColor: activeColors.primary }]}
              onPress={() => setViewMode('create')}
            >
              <Plus color="#fff" size={18} style={{ marginRight: 6 }} />
              <Text style={styles.emptyCreateBtnText}>Tạo lịch hẹn ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          appointments.map((item) => {
            const statusInfo = mapStatusLabel(item.status);
            const isPending =
              String(item.status || '')
                .toLowerCase()
                .includes('pending') ||
              String(item.status || '')
                .toLowerCase()
                .includes('cho');
            const hasValidDate =
              item.appointmentDate &&
              item.appointmentDate !== 'Chưa cập nhật' &&
              !String(item.appointmentDate).startsWith('0001') &&
              !String(item.appointmentDate).startsWith('1/1/0001');
            const hasValidNotes =
              item.notes &&
              item.notes !== 'Không có' &&
              item.notes !== 'Chưa cập nhật' &&
              item.notes.trim().length > 0;
            const hasTracking = Boolean(item.trackingToken);
            const hasFooter = hasTracking || isPending;

            return (
              <View
                key={String(item.id)}
                style={[
                  styles.appointmentCard,
                  { backgroundColor: activeColors.cardBg, borderColor: activeColors.border },
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.serviceTitleRow}>
                    <Wrench size={16} color={activeColors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.serviceTitleText, { color: activeColors.text }]}>
                      {item.serviceType || 'Dịch vụ bảo dưỡng'}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  {hasValidDate ? (
                    <View style={styles.infoRow}>
                      <Clock size={15} color={activeColors.subtext} />
                      <Text style={[styles.infoRowText, { color: activeColors.text }]}>
                        {item.appointmentDate}
                      </Text>
                    </View>
                  ) : null}

                  {hasValidNotes ? (
                    <View style={styles.infoRow}>
                      <FileText size={15} color={activeColors.subtext} />
                      <Text
                        style={[styles.infoRowText, { color: activeColors.subtext }]}
                        numberOfLines={2}
                      >
                        {item.notes}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {hasFooter && (
                  <View style={[styles.cardFooter, { borderTopColor: activeColors.border }]}>
                    {hasTracking ? (
                      <TouchableOpacity
                        style={[styles.trackingBtn, { borderColor: activeColors.primary }]}
                        onPress={() =>
                          navigation.navigate('ContactStaff', {
                            ticketId: item.id,
                            trackingToken: item.trackingToken,
                          })
                        }
                      >
                        <MessageSquare
                          size={14}
                          color={activeColors.primary}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={[styles.trackingBtnText, { color: activeColors.primary }]}>
                          Xem tiến độ
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View />
                    )}

                    {isPending && (
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => handleCancelAppointment(item)}
                      >
                        <XCircle size={14} color="#EF4444" style={{ marginRight: 4 }} />
                        <Text style={styles.cancelBtnText}>Hủy lịch</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );

  const renderCreateView = () => (
    <View style={{ flex: 1 }}>
      {}
      <View
        style={[
          styles.header,
          { borderBottomColor: activeColors.border, backgroundColor: activeColors.cardBg },
        ]}
      >
        <TouchableOpacity onPress={() => setViewMode('list')} style={styles.backButton}>
          <ChevronLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Tạo Lịch Hẹn Mới</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.introBlock}>
          <Text style={[styles.introText, { color: activeColors.subtext }]}>
            Vui lòng điền thông tin bên dưới để đặt lịch. Chúng tôi sẽ liên hệ lại với bạn trong
            thời gian sớm nhất để xác nhận.
          </Text>
        </View>

        {}
        <View style={[styles.section, blockBg]}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
            1. THÔNG TIN LIÊN HỆ
          </Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={18} color={activeColors.subtext} />
            </View>
            <TextInput
              style={[styles.input, { color: activeColors.text, borderColor: activeColors.border }]}
              placeholder="Họ và tên *"
              placeholderTextColor={activeColors.subtext}
              value={formData.fullName}
              onChangeText={(text) => updateField('fullName', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Phone size={18} color={activeColors.subtext} />
            </View>
            <TextInput
              style={[styles.input, { color: activeColors.text, borderColor: activeColors.border }]}
              placeholder="Số điện thoại *"
              placeholderTextColor={activeColors.subtext}
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(text) => updateField('phoneNumber', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Mail size={18} color={activeColors.subtext} />
            </View>
            <TextInput
              style={[styles.input, { color: activeColors.text, borderColor: activeColors.border }]}
              placeholder="Email (không bắt buộc)"
              placeholderTextColor={activeColors.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
            />
          </View>
        </View>

        {}
        <View style={[styles.section, blockBg]}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
            2. DỊCH VỤ & THỜI GIAN
          </Text>

          <Text style={[styles.fieldLabel, { color: activeColors.subtext }]}>Loại dịch vụ *</Text>
          <View style={styles.optionsWrap}>
            {serviceOptions.map((opt) => {
              const isSelected = formData.serviceType === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isSelected
                        ? activeColors.primary + '15'
                        : activeColors.background,
                      borderColor: isSelected ? activeColors.primary : activeColors.border,
                    },
                  ]}
                  onPress={() => updateField('serviceType', opt)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isSelected ? activeColors.primary : activeColors.text,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, { color: activeColors.subtext, marginTop: 16 }]}>
            Ngày & Giờ hẹn mong muốn *
          </Text>
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Calendar size={18} color={activeColors.subtext} />
            </View>
            <TextInput
              style={[styles.input, { color: activeColors.text, borderColor: activeColors.border }]}
              placeholder="Ví dụ: Sáng mai (15/10), 14:00 ngày 20/10..."
              placeholderTextColor={activeColors.subtext}
              value={formData.appointmentDate}
              onChangeText={(text) => updateField('appointmentDate', text)}
            />
          </View>
        </View>

        {}
        <View style={[styles.section, blockBg]}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
            3. GHI CHÚ BỔ SUNG
          </Text>

          <View style={styles.inputGroupArea}>
            <View style={[styles.inputIcon, { marginTop: 10 }]}>
              <FileText size={18} color={activeColors.subtext} />
            </View>
            <TextInput
              style={[
                styles.inputArea,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
              placeholder="Bạn muốn thêm biển số xe, yêu cầu thợ ruột, hoặc mô tả tình trạng xe ở đây..."
              placeholderTextColor={activeColors.subtext}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.notes}
              onChangeText={(text) => updateField('notes', text)}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {}
      <View
        style={[
          styles.bottomBar,
          { borderTopColor: activeColors.border, backgroundColor: activeColors.cardBg },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: activeColors.primary, opacity: isLoading ? 0.7 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <CheckCircle2 color="#fff" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.submitText}>Xác nhận đặt lịch</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
      edges={['top', 'bottom']}
    >
      {viewMode === 'list' ? renderListView() : renderCreateView()}
      <Toast ref={toastRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  headerActionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerCreate: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
  },
  plusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  centerBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    marginTop: 10,
  },
  emptyBox: {
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
  },
  emptyCreateBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  serviceTitleText: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    gap: 6,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoRowText: {
    fontSize: 13,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  trackingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  trackingBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  introBlock: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  inputGroupArea: {
    flexDirection: 'row',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
  },
  inputArea: {
    flex: 1,
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
