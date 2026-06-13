import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';

const { width } = Dimensions.get('window');

// Use dark theme as default fallback since background colors are dynamic
const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#111111';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';
const DEFAULT_BORDER = 'rgba(255, 255, 255, 0.06)';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(15), marginBottom: verticalScale(10) },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: DEFAULT_CARD, borderRadius: Theme.radius.md, paddingHorizontal: horizontalScale(12), height: verticalScale(48) },
  searchInput: { flex: 1, color: DEFAULT_TEXT, fontSize: moderateScale(14), marginLeft: horizontalScale(10) },
  aiBtn: { padding: moderateScale(5) },
  filterBtn: { width: horizontalScale(48), height: horizontalScale(48), borderRadius: Theme.radius.full, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginLeft: horizontalScale(10) },

  aiBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', marginHorizontal: horizontalScale(20), padding: moderateScale(10), borderRadius: Theme.radius.sm, marginBottom: verticalScale(20) },
  aiBannerText: { color: '#F59E0B', fontSize: moderateScale(12), fontWeight: '600', marginLeft: horizontalScale(8) },

  filterSection: { marginBottom: verticalScale(20) },
  filterGroupTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(16), fontWeight: 'bold', marginHorizontal: horizontalScale(20), marginBottom: verticalScale(12) },
  chipContainer: { paddingLeft: horizontalScale(20) },
  chip: { paddingHorizontal: horizontalScale(16), paddingVertical: verticalScale(8), borderRadius: Theme.radius.full, backgroundColor: DEFAULT_CARD, marginRight: horizontalScale(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeChip: { backgroundColor: Theme.staticColors.primary, borderColor: Theme.staticColors.primary },
  chipText: { color: DEFAULT_TEXT, fontSize: moderateScale(13), fontWeight: '500' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },

  brandChip: { width: horizontalScale(100), height: verticalScale(100), borderRadius: Theme.radius.md, backgroundColor: DEFAULT_CARD, marginRight: horizontalScale(12), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent', padding: moderateScale(10) },
  activeBrandChip: { borderColor: Theme.staticColors.primary, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  brandLogo: { width: horizontalScale(50), height: horizontalScale(50), marginBottom: verticalScale(8) },
  brandText: { color: DEFAULT_TEXT, fontSize: moderateScale(12), fontWeight: '600' },
  activeBrandText: { color: Theme.staticColors.primary },

  typeChip: { width: horizontalScale(120), height: verticalScale(90), borderRadius: Theme.radius.md, backgroundColor: DEFAULT_CARD, marginRight: horizontalScale(12), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent', padding: moderateScale(10) },
  activeTypeChip: { borderColor: Theme.staticColors.primary, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  typeIcon: { width: horizontalScale(40), height: horizontalScale(40), marginBottom: verticalScale(6) },
  typeText: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), fontWeight: '600' },
  activeTypeText: { color: Theme.staticColors.primary },

  verticalTypeContainer: { paddingHorizontal: horizontalScale(20) },
  verticalTypeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: DEFAULT_CARD, padding: moderateScale(15), borderRadius: Theme.radius.md, marginBottom: verticalScale(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeTypeCard: { borderColor: Theme.staticColors.primary, backgroundColor: 'rgba(59, 130, 246, 0.05)' },
  typeCardInner: { flexDirection: 'row', alignItems: 'center' },
  typeIconSmall: { width: horizontalScale(30), height: horizontalScale(30), marginRight: horizontalScale(15) },
  typeTextLarge: { color: DEFAULT_TEXT, fontSize: moderateScale(15), fontWeight: '600' },
  activeTypeTextLarge: { color: Theme.staticColors.primary },

  grid: { paddingHorizontal: horizontalScale(15), paddingBottom: verticalScale(100) },
  motorCardWrapper: { width: '100%', marginBottom: verticalScale(15) },
  motorCardOpen: { padding: moderateScale(20), borderRadius: Theme.radius.md, backgroundColor: DEFAULT_CARD, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  motorName: { color: DEFAULT_TEXT, fontSize: moderateScale(16), fontWeight: 'bold' },

  scanOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: width * 0.7, height: width * 0.7, borderWidth: 2, borderColor: Theme.staticColors.primary, borderRadius: 20, overflow: 'hidden' },
  scanLine: { width: '100%', height: 4, boxShadow: '0 0 10px Theme.staticColors.primary' },
  scanText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold', marginTop: verticalScale(30) },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  modalSheet: { backgroundColor: '#050505', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: moderateScale(25), paddingBottom: verticalScale(50) },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: verticalScale(20) },
  modalTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(20), fontWeight: 'bold', marginBottom: verticalScale(8) },
  modalMotorName: { color: Theme.staticColors.primary, fontSize: moderateScale(16), fontWeight: '600', marginBottom: verticalScale(25) },
  modalLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(13), marginBottom: verticalScale(10) },
  modalInputOpen: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: Theme.radius.md, paddingHorizontal: horizontalScale(15), height: verticalScale(55), justifyContent: 'center', marginBottom: verticalScale(30) },
  modalTextInput: { color: DEFAULT_TEXT, fontSize: moderateScale(16) },
  modalSendBtn: { backgroundColor: Theme.staticColors.primary, height: verticalScale(55), borderRadius: Theme.radius.md, justifyContent: 'center', alignItems: 'center' },
  modalSendText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold' }
});

