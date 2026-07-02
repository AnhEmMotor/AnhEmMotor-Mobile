import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';

const { width } = Dimensions.get('window');

const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#111111';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';
const DEFAULT_BORDER = 'rgba(255, 255, 255, 0.06)';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },
  scrollContent: { paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(10), paddingBottom: verticalScale(40), flexGrow: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(20) },
  backBtn: { marginRight: horizontalScale(15), padding: 5 },
  title: { color: DEFAULT_TEXT, fontSize: moderateScale(26), fontWeight: 'bold' },
  
  spotlightCard: { padding: moderateScale(20), borderRadius: Theme.radius.lg, marginBottom: verticalScale(25), overflow: 'hidden' },
  greeting: { color: 'rgba(255, 255, 255, 0.65)', fontSize: moderateScale(14), marginBottom: verticalScale(2) },
  spotlightTitle: { color: '#fff', fontSize: moderateScale(21), fontWeight: 'bold', marginBottom: verticalScale(16) },
  spotlightActions: { flexDirection: 'row', justifyContent: 'space-between' },
  primaryBtn: { flex: 1, height: verticalScale(48), borderRadius: Theme.radius.md, backgroundColor: Theme.staticColors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: horizontalScale(12) },
  primaryBtnText: { color: '#fff', fontSize: moderateScale(13), fontWeight: 'bold', marginLeft: horizontalScale(8) },
  secondaryBtn: { flex: 1, height: verticalScale(48), borderRadius: Theme.radius.md, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: DEFAULT_TEXT, fontSize: moderateScale(13), fontWeight: '600', marginLeft: horizontalScale(8) },
  
  sectionLabel: { color: DEFAULT_TEXT, fontSize: moderateScale(18), fontWeight: 'bold', marginTop: verticalScale(10), marginBottom: verticalScale(15) },
  
  formCard: { padding: moderateScale(18), borderRadius: Theme.radius.lg, marginBottom: verticalScale(25) },
  dropdownLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), marginBottom: verticalScale(6) },
  dropdownSelector: { height: verticalScale(48), borderRadius: Theme.radius.md, backgroundColor: 'rgba(0,0,0,0.25)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: horizontalScale(16), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(16) },
  dropdownVal: { color: '#fff', fontSize: moderateScale(14), fontWeight: '600' },
  textareaContainer: { minHeight: verticalScale(120), borderRadius: Theme.radius.md, backgroundColor: 'rgba(0,0,0,0.25)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: moderateScale(12), marginBottom: verticalScale(8), position: 'relative' },
  textarea: { color: '#fff', fontSize: moderateScale(14), textAlignVertical: 'top', minHeight: verticalScale(85), paddingBottom: verticalScale(15) },
  charCounter: { position: 'absolute', bottom: verticalScale(8), right: horizontalScale(12), color: 'rgba(255, 255, 255, 0.4)', fontSize: moderateScale(10) },
  
  formFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: verticalScale(12) },
  attachRow: { flexDirection: 'row', alignItems: 'center' },
  attachIconBtn: { width: horizontalScale(44), height: horizontalScale(44), borderRadius: Theme.radius.sm, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: horizontalScale(10) },
  attachPreview: { width: horizontalScale(44), height: horizontalScale(44), borderRadius: Theme.radius.sm, marginRight: horizontalScale(8), position: 'relative' },
  attachImg: { width: '100%', height: '100%', borderRadius: Theme.radius.sm },
  attachRemove: { position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: 8, backgroundColor: '#E11D48', justifyContent: 'center', alignItems: 'center' },
  attachRemoveText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
  submitBtn: { flex: 1, height: verticalScale(48), borderRadius: Theme.radius.md, backgroundColor: Theme.staticColors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: horizontalScale(12) },
  submitBtnDisabled: { flex: 1, height: verticalScale(48), borderRadius: Theme.radius.md, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginLeft: horizontalScale(12) },
  submitBtnText: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold' },
  submitBtnTextDisabled: { color: 'rgba(255, 255, 255, 0.25)', fontSize: moderateScale(14), fontWeight: 'bold' },
  
  ticketScroll: { paddingBottom: 5 },
  ticketCard: { width: horizontalScale(260), padding: moderateScale(14), marginRight: horizontalScale(15), borderRadius: Theme.radius.md },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(8) },
  ticketType: { color: Theme.staticColors.primary, fontSize: moderateScale(12), fontWeight: 'bold' },
  ticketStatus: { fontSize: moderateScale(11), fontWeight: '600' },
  ticketContent: { color: DEFAULT_TEXT, fontSize: moderateScale(13), lineHeight: 18, marginBottom: verticalScale(8) },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketDate: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(11) },
  ticketCta: { color: '#E31B23', fontSize: moderateScale(11), fontWeight: 'bold' },
  
  searchBox: { height: verticalScale(48), borderRadius: Theme.radius.md, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: horizontalScale(15), marginBottom: verticalScale(15) },
  searchInput: { flex: 1, color: '#fff', fontSize: moderateScale(14), marginLeft: horizontalScale(10) },
  faqCatBox: { marginBottom: verticalScale(15) },
  faqCatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(10) },
  faqCatTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(14), fontWeight: 'bold', marginLeft: horizontalScale(8) },
  faqAccordion: { borderRadius: Theme.radius.md, marginBottom: verticalScale(8), overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: moderateScale(14) },
  faqQuestion: { color: DEFAULT_TEXT, fontSize: moderateScale(13), fontWeight: '600', flex: 1, paddingRight: horizontalScale(10) },
  faqContent: { paddingHorizontal: moderateScale(14), paddingBottom: moderateScale(14), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.03)', paddingTop: verticalScale(8) },
  faqAnswer: { color: 'rgba(255,255,255,0.7)', fontSize: moderateScale(12), lineHeight: 18 },
  
  systemCard: { padding: moderateScale(18), borderRadius: Theme.radius.lg, marginBottom: verticalScale(20) },
  systemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(12) },
  systemTitle: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold', marginLeft: horizontalScale(8) },
  systemAddress: { color: 'rgba(255,255,255,0.8)', fontSize: moderateScale(13), lineHeight: 18, marginBottom: verticalScale(6) },
  systemHours: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), marginBottom: verticalScale(15) },
  mapBtn: { height: verticalScale(48), borderRadius: Theme.radius.md, backgroundColor: '#B91C1C', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  mapBtnText: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold', marginLeft: horizontalScale(8) },
  
  sheetContent: { padding: moderateScale(20) },
  sheetOption: { height: verticalScale(50), justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  sheetOptionText: { color: DEFAULT_TEXT, fontSize: moderateScale(14), fontWeight: '500' },
  sheetOptionSelectedText: { color: Theme.staticColors.primary, fontSize: moderateScale(14), fontWeight: 'bold' },
  
  ticketDetailBox: { padding: moderateScale(5) },
  ticketDetailMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(12) },
  ticketDetailContent: { color: '#fff', fontSize: moderateScale(14), lineHeight: 20, marginBottom: verticalScale(20) },
  chatBox: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: Theme.radius.md, padding: moderateScale(14), borderLeftWidth: 3, borderLeftColor: Theme.staticColors.primary },
  chatAuthor: { color: Theme.staticColors.primary, fontSize: moderateScale(12), fontWeight: 'bold', marginBottom: verticalScale(4) },
  chatText: { color: 'rgba(255,255,255,0.85)', fontSize: moderateScale(13), lineHeight: 19 },
  
  sheetActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: verticalScale(20) },
  sheetCloseBtn: { flex: 1, height: verticalScale(44), borderRadius: Theme.radius.md, backgroundColor: Theme.staticColors.success, justifyContent: 'center', alignItems: 'center', marginRight: horizontalScale(10) },
  sheetCloseBtnText: { color: '#fff', fontSize: moderateScale(13), fontWeight: 'bold' },
  sheetDiscussBtn: { flex: 1, height: verticalScale(44), borderRadius: Theme.radius.md, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  sheetDiscussBtnText: { color: DEFAULT_TEXT, fontSize: moderateScale(13), fontWeight: '600' },

  faqDetailQuestion: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold', marginBottom: verticalScale(15), lineHeight: 22 },
  faqDetailAnswerBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: Theme.radius.md, padding: moderateScale(16), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  faqDetailAnswer: { color: 'rgba(255,255,255,0.8)', fontSize: moderateScale(14), lineHeight: 22 },

  systemContactContainer: { marginBottom: verticalScale(15), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: verticalScale(12) },
  systemContactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(10) },
  systemContactText: { color: 'rgba(255,255,255,0.9)', fontSize: moderateScale(13), marginLeft: horizontalScale(10) }
});

