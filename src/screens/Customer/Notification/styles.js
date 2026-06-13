import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';

const { width } = Dimensions.get('window');

// Use dark theme as default fallback since background colors are dynamic
const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#111111';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: horizontalScale(20), marginTop: verticalScale(10), marginBottom: verticalScale(15) },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.staticColors.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { color: Theme.staticColors.text, fontSize: moderateScale(22), fontWeight: 'bold' },
  markReadText: { color: Theme.staticColors.primary, fontSize: moderateScale(14), fontWeight: 'bold' },
  
  // Sub-header controls (Unread Filter)
  controlsRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: horizontalScale(20), marginBottom: verticalScale(15) },
  filterBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  filterBadgeActive: { backgroundColor: 'rgba(46, 91, 255, 0.1)', borderColor: 'rgba(46, 91, 255, 0.3)' },
  filterBadgeText: { color: Theme.staticColors.subtext, fontSize: moderateScale(12), fontWeight: '600' },
  filterBadgeTextActive: { color: Theme.staticColors.primary, fontWeight: 'bold' },

  // Scrollable horizontal tab bar
  tabBarScroll: { marginBottom: verticalScale(12), height: 64, marginHorizontal: horizontalScale(8) },
  tabBarContent: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 6, alignItems: 'center', height: '100%' },
  tab: { flexDirection: 'row', paddingHorizontal: horizontalScale(18), height: '100%', alignItems: 'center', borderRadius: 14, marginHorizontal: 4, flexShrink: 0 },
  activeTab: { backgroundColor: Theme.staticColors.card },
  tabText: { color: Theme.staticColors.subtext, fontWeight: 'bold', fontSize: moderateScale(12), letterSpacing: 0.2, flexShrink: 0 },
  activeTabText: { color: Theme.staticColors.primary },
  tabBadge: { backgroundColor: Theme.staticColors.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8, flexShrink: 0 },
  tabBadgeText: { color: '#fff', fontSize: moderateScale(10), fontWeight: '900' },
 
  // Notification List
  list: { paddingHorizontal: horizontalScale(16), paddingBottom: 80 },
  card: { flexDirection: 'row', paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(12), marginBottom: verticalScale(10), borderRadius: Theme.radius.md, borderLeftWidth: 3, borderLeftColor: 'transparent', position: 'relative' },
  unreadCard: { backgroundColor: 'rgba(46, 91, 255, 0.03)', borderColor: 'rgba(46, 91, 255, 0.12)', borderLeftColor: Theme.staticColors.primary },
  readCard: { borderColor: 'rgba(255,255,255,0.03)' },
  unreadDot: { position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: Theme.staticColors.primary },
  
  // Icon and backgrounds
  iconBox: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginRight: horizontalScale(10) },
  // Category specific pastel backdrops
  iconService: { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  iconLoyalty: { backgroundColor: 'rgba(168, 85, 247, 0.1)' },
  iconSystem: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
 
  contentBox: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  title: { color: Theme.staticColors.text, fontSize: moderateScale(14), fontWeight: 'bold', flex: 1, marginRight: 10 },
  time: { color: 'rgba(255,255,255,0.3)', fontSize: moderateScale(9) },
  desc: { color: Theme.staticColors.subtext, fontSize: moderateScale(12), lineHeight: 17, marginBottom: 4 },
  
  // Action Buttons
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, alignSelf: 'flex-start' },
  actionBtnActive: { backgroundColor: 'rgba(46, 91, 255, 0.08)' },
  actionText: { color: Theme.staticColors.primary, fontSize: moderateScale(11), fontWeight: 'bold' },

  // Modals Styling
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' },
  modalSheet: { backgroundColor: '#050505', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: verticalScale(40), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderBottomWidth: 0 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginBottom: 20 },
  modalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { color: Theme.staticColors.text, fontSize: moderateScale(22), fontWeight: 'bold' },
  modalSub: { color: Theme.staticColors.subtext, fontSize: moderateScale(13), marginBottom: 25 },

  // Map Tracking Modal
  mapContainer: { width: '100%', height: 220, backgroundColor: '#111111', borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  mapGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.15 },
  roadLine: { position: 'absolute', width: '80%', height: 3, backgroundColor: 'rgba(255,255,255,0.1)', top: '50%' },
  roadActiveLine: { position: 'absolute', width: '45%', height: 3, backgroundColor: Theme.staticColors.primary, top: '50%', left: '10%' },
  warehouseNode: { position: 'absolute', left: '10%', top: '44%', alignItems: 'center' },
  showroomNode: { position: 'absolute', right: '10%', top: '44%', alignItems: 'center' },
  truckNode: { position: 'absolute', left: '50%', top: '42%', alignItems: 'center' },
  nodeLabel: { color: '#fff', fontSize: moderateScale(9), fontWeight: 'bold', marginTop: 4 },
  mapStatusText: { position: 'absolute', bottom: 12, left: 16, color: '#10B981', fontSize: moderateScale(12), fontWeight: 'bold' },

  // Live Workshop Modal
  workshopCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  workshopTitle: { color: '#fff', fontSize: moderateScale(15), fontWeight: 'bold', marginBottom: 12 },
  techRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  techAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Theme.staticColors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  techAvatarText: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold' },
  techName: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold' },
  techTitle: { color: Theme.staticColors.subtext, fontSize: moderateScale(11) },
  partItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  partName: { color: Theme.staticColors.subtext, fontSize: moderateScale(13) },
  partDone: { color: '#10B981', fontSize: moderateScale(12), fontWeight: 'bold' },
  partPending: { color: Theme.staticColors.warning, fontSize: moderateScale(12), fontWeight: 'bold' },

  // Coupon / Referral Card Modal
  couponCard: { width: '100%', backgroundColor: '#1E1B4B', padding: 20, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(168, 85, 247, 0.3)', borderStyle: 'dashed', alignItems: 'center', marginBottom: 20 },
  couponLabel: { color: 'rgba(168, 85, 247, 0.8)', fontSize: moderateScale(11), fontWeight: 'bold', letterSpacing: 1, marginBottom: 6 },
  couponCodeText: { color: '#fff', fontSize: moderateScale(26), fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  couponDesc: { color: Theme.staticColors.subtext, fontSize: moderateScale(12), textAlign: 'center', lineHeight: 18 },

  // Barcode Voucher Modal
  barcodeContainer: { backgroundColor: '#fff', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  barcodeFake: { width: '90%', height: 60, marginVertical: 10, justifyContent: 'space-around', flexDirection: 'row' },
  barcodeBar: { width: 2, height: '100%', backgroundColor: '#000' },
  barcodeText: { color: '#000', fontSize: moderateScale(12), letterSpacing: 4, fontWeight: 'bold' },

  // e-Invoice PDF Modal
  invoiceSheet: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, borderTopWidth: 5, borderTopColor: Theme.staticColors.primary },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 15, marginBottom: 15 },
  invoiceLogo: { color: '#1E3A8A', fontSize: moderateScale(16), fontWeight: '900' },
  invoiceTitle: { color: '#475569', fontSize: moderateScale(11), fontWeight: 'bold' },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  invoiceLabel: { color: '#64748B', fontSize: moderateScale(13) },
  invoiceVal: { color: '#111111', fontSize: moderateScale(13), fontWeight: 'bold' },
  invoiceTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12, marginTop: 12 },
  invoiceTotalVal: { color: '#1E3A8A', fontSize: moderateScale(18), fontWeight: 'bold' },

  // Feedback Letter Modal
  letterPaper: { backgroundColor: '#FEFBF3', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 20, ...Platform.select({ web: { boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 } }) },
  letterHeader: { borderBottomWidth: 1, borderBottomColor: '#EBE5DA', paddingBottom: 10, marginBottom: 15 },
  letterLogo: { color: '#8B5A2B', fontSize: moderateScale(14), fontWeight: 'bold', letterSpacing: 1 },
  letterDate: { color: '#A3998D', fontSize: moderateScale(11), marginTop: 2 },
  letterBody: { color: '#4A3E31', fontSize: moderateScale(13), lineHeight: 22, fontStyle: 'italic', marginBottom: 20 },
  letterFooter: { color: '#8B5A2B', fontSize: moderateScale(12), fontWeight: 'bold', textAlign: 'right' },

  // Buttons in Modal
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  modalActionBtn: { height: 55, borderRadius: 16, backgroundColor: Theme.staticColors.primary, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%' },
  modalActionText: { color: '#fff', fontSize: moderateScale(15), fontWeight: 'bold', marginLeft: 10 },

  // Demo Toggle Switch
  demoToggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  demoToggleText: { color: Theme.staticColors.subtext, fontSize: moderateScale(12), fontWeight: '600' },
  demoToggleButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  demoToggleButtonActive: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderWidth: 1, borderColor: '#10B981' },
  demoToggleButtonInactive: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  demoToggleButtonLabel: { color: '#fff', fontSize: moderateScale(10), fontWeight: 'bold', letterSpacing: 0.5 },

  // Block 1: Workshop Live Card
  workshopLiveCard: { backgroundColor: 'rgba(16, 185, 129, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.15)' },
  workshopLiveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  workshopLiveTitle: { color: '#10B981', fontSize: moderateScale(15), fontWeight: 'bold' },
  livePulseBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  livePulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 5 },
  livePulseText: { color: '#10B981', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  vehicleInfoText: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold', marginBottom: 12 },
  
  ktvRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  ktvAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Theme.staticColors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  ktvAvatarText: { color: '#fff', fontSize: moderateScale(13), fontWeight: 'bold' },
  ktvName: { color: '#fff', fontSize: moderateScale(13), fontWeight: 'bold' },
  ktvSub: { color: Theme.staticColors.subtext, fontSize: moderateScale(11), marginTop: 1 },

  // Steppers vertical
  stepperContainer: { paddingLeft: 6 },
  stepItem: { flexDirection: 'row', minHeight: 60, position: 'relative' },
  stepLine: { position: 'absolute', left: 10, top: 20, bottom: -10, width: 2 },
  stepLineCompleted: { backgroundColor: '#10B981' },
  stepLinePending: { backgroundColor: 'rgba(255,255,255,0.08)' },
  
  stepIndicator: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', zIndex: 1, marginRight: 12 },
  stepIndicatorCompleted: { backgroundColor: '#10B981' },
  stepIndicatorActive: { backgroundColor: '#090E17', borderWidth: 2, borderColor: '#10B981' },
  stepIndicatorPending: { backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  
  activeDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  pendingStepText: { color: 'rgba(255,255,255,0.3)', fontSize: moderateScale(10), fontWeight: 'bold' },
  
  stepContent: { flex: 1, paddingBottom: 15 },
  stepLabel: { color: 'rgba(255,255,255,0.4)', fontSize: moderateScale(13), fontWeight: '600' },
  stepLabelCompleted: { color: '#fff', fontWeight: 'bold' },
  stepLabelActive: { color: '#10B981', fontWeight: 'bold' },
  stepDesc: { color: 'rgba(255,255,255,0.25)', fontSize: moderateScale(11), marginTop: 2, lineHeight: 15 },
  stepDescActive: { color: Theme.staticColors.subtext, fontSize: moderateScale(12), fontWeight: '500' },

  // Block 2: Maintenance alert card
  alertCard: { backgroundColor: 'rgba(217, 119, 6, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(217, 119, 6, 0.15)' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  alertTitle: { color: Theme.staticColors.warning, fontSize: moderateScale(15), fontWeight: 'bold' },
  alertBadge: { backgroundColor: 'rgba(217, 119, 6, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  alertBadgeText: { color: Theme.staticColors.warning, fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  alertDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },
  
  odoContainer: { backgroundColor: 'rgba(0,0,0,0.15)', padding: 12, borderRadius: 12, marginBottom: 18 },
  odoBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  odoBarActive: { height: '100%', backgroundColor: Theme.staticColors.warning, borderRadius: 3 },
  odoLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  odoLabelText: { color: Theme.staticColors.subtext, fontSize: moderateScale(11) },
  
  alertCtaButton: { height: 48, borderRadius: 14, backgroundColor: Theme.staticColors.primary, justifyContent: 'center', alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: `0px 4px 8px ${Theme.staticColors.primary}33` }, default: { shadowColor: Theme.staticColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 } }) },
  alertCtaText: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold' },

  // Block 3: History section
  historySection: { marginTop: 10 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  historyTitle: { color: '#10B981', fontSize: moderateScale(15), fontWeight: 'bold' },
  historySubtitle: { color: Theme.staticColors.subtext, fontSize: moderateScale(11), lineHeight: 16, marginBottom: 15 },
  
  historyItemCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  historyItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', paddingBottom: 10, marginBottom: 10 },
  historyItemDate: { color: '#fff', fontSize: moderateScale(13), fontWeight: 'bold' },
  historyItemLocation: { color: Theme.staticColors.subtext, fontSize: moderateScale(10), marginTop: 1 },
  cleanCarBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  cleanCarBadgeText: { color: '#10B981', fontSize: moderateScale(9), fontWeight: 'bold' },
  
  historyPartsTitle: { color: Theme.staticColors.subtext, fontSize: moderateScale(11), fontWeight: 'bold', marginBottom: 4 },
  historyPartsText: { color: '#fff', fontSize: moderateScale(12), lineHeight: 17, marginBottom: 10 },
  
  historyFooter: { flexDirection: 'column', alignItems: 'flex-start', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)', paddingTop: 10 },
  historyCost: { color: Theme.staticColors.subtext, fontSize: moderateScale(12), marginBottom: 4 },
  historyWarranty: { color: 'rgba(255,255,255,0.35)', fontSize: moderateScale(11) },

  // Booking Modal styling
  bookingSectionTitle: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
  bookingDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  bookingDateCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginHorizontal: 3 },
  bookingDateCardActive: { backgroundColor: Theme.staticColors.primary, borderColor: Theme.staticColors.primary },
  bookingDateDayLabel: { color: Theme.staticColors.subtext, fontSize: moderateScale(11), fontWeight: 'bold' },
  bookingDateDayNumber: { color: '#fff', fontSize: moderateScale(18), fontWeight: '900', marginVertical: 3 },
  bookingDateDayDesc: { color: Theme.staticColors.subtext, fontSize: moderateScale(10) },
  bookingDateTextActive: { color: '#fff' },
  
  bookingTimeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bookingTimeCard: { width: '31%', backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  bookingTimeCardActive: { backgroundColor: Theme.staticColors.primary, borderColor: Theme.staticColors.primary },
  bookingTimeText: { color: Theme.staticColors.subtext, fontSize: moderateScale(12), fontWeight: 'bold' },
  bookingTimeTextActive: { color: '#fff' },

  // Block 1: Loyalty member card styles
  loyaltyMemberCard: { backgroundColor: 'rgba(168, 85, 247, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.15)' },
  loyaltyMemberHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  loyaltyMemberTitle: { color: '#A855F7', fontSize: moderateScale(15), fontWeight: 'bold' },
  goldBadge: { backgroundColor: 'rgba(168, 85, 247, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  goldBadgeText: { color: '#A855F7', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  
  memberCardContainer: { paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  virtualMemberCard: { width: '100%', height: 160, borderRadius: 16, padding: 18, justifyContent: 'space-between', backgroundColor: '#1A1816', borderWidth: 1.5, borderColor: '#F59E0B' },
  virtualCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  virtualCardBrand: { color: '#fff', fontSize: moderateScale(14), fontWeight: '900', letterSpacing: 0.5 },
  virtualCardTier: { color: '#F59E0B', fontSize: moderateScale(18), fontWeight: '900', letterSpacing: 1 },
  virtualCardName: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold', letterSpacing: 1 },
  virtualCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  virtualCardNumber: { color: 'rgba(255, 255, 255, 0.6)', fontSize: moderateScale(12), fontWeight: '500' },
  virtualCardPoints: { color: '#F59E0B', fontSize: moderateScale(15), fontWeight: 'bold' },
  
  loyaltyMemberDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },
  loyaltyCtaButton: { height: 48, borderRadius: 14, backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: '0px 4px 8px rgba(168, 85, 247, 0.2)' }, default: { shadowColor: '#A855F7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 } }) },
  loyaltyCtaText: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold' },

  // Block 2: Voucher ticket styles
  loyaltyVoucherCard: { backgroundColor: 'rgba(59, 130, 246, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.15)' },
  loyaltyVoucherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  loyaltyVoucherTitle: { color: Theme.staticColors.primary, fontSize: moderateScale(15), fontWeight: 'bold' },
  voucherUrgentBadge: { backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  voucherUrgentBadgeText: { color: '#EF4444', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  
  dashedVoucherBody: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', height: 80, overflow: 'hidden', marginBottom: 15 },
  dashedVoucherLeft: { width: '30%', backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' },
  voucherValBig: { color: '#E31B23', fontSize: moderateScale(28), fontWeight: '900' },
  voucherValLabel: { color: '#E31B23', fontSize: moderateScale(9), fontWeight: 'bold', letterSpacing: 1 },
  dashedVoucherRight: { flex: 1, paddingLeft: 16, justifyContent: 'center' },
  voucherNameTitle: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold' },
  voucherCodeLabel: { color: Theme.staticColors.subtext, fontSize: moderateScale(11), marginTop: 4, letterSpacing: 0.5 },
  loyaltyVoucherDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },

  // Block 3: Birthday styles
  loyaltyBirthdayCard: { backgroundColor: 'rgba(236, 72, 153, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(236, 72, 153, 0.15)' },
  loyaltyBirthdayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  loyaltyBirthdayTitle: { color: '#EC4899', fontSize: moderateScale(15), fontWeight: 'bold' },
  birthdayBadge: { backgroundColor: 'rgba(236, 72, 153, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  birthdayBadgeText: { color: '#EC4899', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  
  birthdayGiftBox: { backgroundColor: 'rgba(236, 72, 153, 0.08)', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(236, 72, 153, 0.1)' },
  birthdayGiftTitle: { color: '#fff', fontSize: moderateScale(13), fontWeight: 'bold' },
  birthdayGiftSub: { color: Theme.staticColors.subtext, fontSize: moderateScale(11), marginTop: 2 },
  loyaltyBirthdayDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },

  // Block 4: Referral styles
  loyaltyReferralCard: { backgroundColor: 'rgba(59, 130, 246, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.15)' },
  loyaltyReferralHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  loyaltyReferralTitle: { color: '#E31B23', fontSize: moderateScale(15), fontWeight: 'bold' },
  referralActiveBadge: { backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  referralActiveBadgeText: { color: '#E31B23', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  
  referralCodeDashCard: { backgroundColor: '#1E1B4B', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' },
  referralCodeTextVal: { color: '#fff', fontSize: moderateScale(22), fontWeight: '900', letterSpacing: 1.5 },
  referralCodeSubText: { color: Theme.staticColors.subtext, fontSize: moderateScale(10), marginTop: 6, textAlign: 'center' },
  loyaltyReferralDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },

  // Block 1: Recall Card
  systemRecallCard: { backgroundColor: 'rgba(239, 68, 68, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.15)' },
  systemRecallHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  systemRecallTitle: { color: '#EF4444', fontSize: moderateScale(15), fontWeight: 'bold' },
  recallUrgentBadge: { backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  recallUrgentBadgeText: { color: '#EF4444', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  systemRecallDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },
  
  systemCtaButton: { height: 48, borderRadius: 14, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: '0px 4px 8px rgba(239, 68, 68, 0.2)' }, default: { shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 } }) },
  systemCtaText: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold' },

  // Block 2: Insurance Card
  systemInsuranceCard: { backgroundColor: 'rgba(217, 119, 6, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(217, 119, 6, 0.15)' },
  systemInsuranceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  systemInsuranceTitle: { color: Theme.staticColors.warning, fontSize: moderateScale(15), fontWeight: 'bold' },
  insuranceWarningBadge: { backgroundColor: 'rgba(217, 119, 6, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  insuranceWarningBadgeText: { color: Theme.staticColors.warning, fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  systemInsuranceDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },

  // Block 3: Invoice Card
  systemInvoiceCard: { backgroundColor: 'rgba(16, 185, 129, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.15)' },
  systemInvoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  systemInvoiceTitle: { color: '#10B981', fontSize: moderateScale(15), fontWeight: 'bold' },
  invoiceGreenBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  invoiceGreenBadgeText: { color: '#10B981', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  
  invoiceSummaryBox: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  invoiceSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  invoiceSummaryLabel: { color: Theme.staticColors.subtext, fontSize: moderateScale(12) },
  invoiceSummaryVal: { color: '#fff', fontSize: moderateScale(12), fontWeight: 'bold' },
  systemInvoiceDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },

  // Block 4: Feedback Card
  systemFeedbackCard: { backgroundColor: 'rgba(59, 130, 246, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.15)' },
  systemFeedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  systemFeedbackTitle: { color: '#E31B23', fontSize: moderateScale(15), fontWeight: 'bold' },
  feedbackBlueBadge: { backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  feedbackBlueBadgeText: { color: '#E31B23', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  
  feedbackParchmentPaper: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#E31B23' },
  feedbackParchmentBody: { color: 'rgba(255,255,255,0.6)', fontSize: moderateScale(12), fontStyle: 'italic', lineHeight: 18 },
  systemFeedbackDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 },

  // Block 5: Security Card
  systemSecurityCard: { backgroundColor: 'rgba(225, 29, 72, 0.03)', borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(225, 29, 72, 0.15)' },
  systemSecurityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  systemSecurityTitle: { color: '#E11D48', fontSize: moderateScale(15), fontWeight: 'bold' },
  securityAlertBadge: { backgroundColor: 'rgba(225, 29, 72, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  securityAlertBadgeText: { color: '#E11D48', fontSize: moderateScale(9), fontWeight: '900', letterSpacing: 0.5 },
  systemSecurityDesc: { color: Theme.staticColors.text, fontSize: moderateScale(13), lineHeight: 19, marginBottom: 15 }
});

