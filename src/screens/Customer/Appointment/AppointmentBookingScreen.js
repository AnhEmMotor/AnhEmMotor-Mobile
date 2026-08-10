import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
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
} from 'lucide-react-native';
import { useActiveColors } from '../../../theme/Theme';
import { useAppointmentBooking } from './useAppointmentBooking';

export default function AppointmentBookingScreen({ navigation }) {
  const activeColors = useActiveColors();
  const { formData, updateField, isLoading, handleSubmit, serviceOptions } =
    useAppointmentBooking(navigation);

  const blockBg = { backgroundColor: activeColors.cardBg, borderColor: activeColors.border };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
      edges={['top', 'bottom']}
    >
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
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Đặt Lịch Hẹn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {}
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
              placeholder="Họ và tên"
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
              placeholder="Số điện thoại"
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

          <Text style={[styles.fieldLabel, { color: activeColors.subtext }]}>Loại dịch vụ</Text>
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
            Ngày & Giờ hẹn mong muốn
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
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
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
