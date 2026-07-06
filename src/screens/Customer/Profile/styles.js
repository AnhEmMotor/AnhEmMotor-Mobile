import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';

const { width } = Dimensions.get('window');

const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#111111';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';
const DEFAULT_BORDER = 'rgba(255, 255, 255, 0.06)';
const PRIMARY = Theme.staticColors.primary;
const SECONDARY = Theme.staticColors.secondary;

const H = horizontalScale;
const V = verticalScale;
const S = moderateScale;

const PAD = H(16);
const GAP = V(12);
const RADIUS = Theme.radius.lg;

export const styles = StyleSheet.create({
 shell: { flex: 1, backgroundColor: DEFAULT_BG },

 scrollContent: { paddingHorizontal: PAD, paddingTop: V(8), paddingBottom: V(170) },

 /* ── HEADER ─────────────────────────────────── */
 headerBlock: {
  alignItems: 'center',
  paddingVertical: V(22),
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.04)',
 },
 avatarWrap: { position: 'relative', marginBottom: V(12) },
 avatar: { width: S(90), height: S(90), borderRadius: S(45), borderWidth: 2.5, borderColor: PRIMARY },
 camBadge: {
  position: 'absolute', bottom: 0, right: 0,
  backgroundColor: PRIMARY, borderRadius: 12,
  justifyContent: 'center', alignItems: 'center',
  width: H(28), height: H(28),
 },
 headerName: { color: DEFAULT_TEXT, fontSize: S(20), fontWeight: '700' },
 headerRole: { color: DEFAULT_SUBTEXT, fontSize: S(13), marginTop: V(4) },
 scoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: V(8), gap: 6 },
 scoreText: { color: PRIMARY, fontSize: S(13), fontWeight: '600' },

 /* ── SHARED BLOCK ───────────────────────────── */
 block: {
  backgroundColor: 'rgba(255,255,255,0.02)',
  borderRadius: RADIUS,
  padding: PAD,
  marginBottom: GAP,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.04)',
 },
 blockTitle: {
  color: DEFAULT_TEXT, fontSize: S(13), fontWeight: '700',
  letterSpacing: 0.5, marginBottom: GAP,
  opacity: 0.9,
 },

 /* ── 2-col GRID (dịch vụ / tài chính) ──────── */
 gridRow: {
  flexDirection: 'row', flexWrap: 'wrap',
  justifyContent: 'space-between', gap: GAP,
 },
 gridRowInner: {
  flexDirection: 'row', flexWrap: 'wrap', gap: H(10),
 },
 gridCol: {
  width: '48%',
  flexDirection: 'row', alignItems: 'center', gap: H(12),
  paddingVertical: V(12), paddingHorizontal: H(12),
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.06)',
  backgroundColor: 'rgba(255,255,255,0.015)',
 },
 gridIcon: { width: H(40), height: H(40), borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
 gridLabel: { color: DEFAULT_TEXT, fontSize: S(13), fontWeight: '500', flex: 1 },

 /* ── 4-col ICON ROW ─────────────────────────── */
 iconRow: { flexDirection: 'row', justifyContent: 'space-between' },
 iconCol: { alignItems: 'center', width: '23%' },
 iconCircle: {
  width: H(48), height: H(48), borderRadius: H(24),
  justifyContent: 'center', alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.03)',
  borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  position: 'relative',
 },
 iconLabel: {
  color: DEFAULT_SUBTEXT, fontSize: S(11),
  textAlign: 'center', marginTop: V(6),
 },
 badge: {
  position: 'absolute', top: -4, right: -4,
  backgroundColor: '#EF4444',
  paddingHorizontal: 5, paddingVertical: 1,
  borderRadius: 8, minWidth: 16, height: 16,
  justifyContent: 'center', alignItems: 'center',
 },
 badgeText: { color: '#fff', fontSize: S(8), fontWeight: 'bold' },
 badgeDot: {
  position: 'absolute', top: 0, right: 0,
  width: 10, height: 10, borderRadius: 5,
  backgroundColor: '#E31B23',
  borderWidth: 1.5, borderColor: DEFAULT_BG,
 },

 /* ── RATING ROW ─────────────────────────────── */
 ratingRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: V(6) },
 ratingItem: { alignItems: 'center' },

 /* ── BOTTOM ACTIONS ─────────────────────────── */
 bottomActions: {
  position: 'absolute', bottom: 0, left: 0, right: 0,
  flexDirection: 'row', gap: H(10),
  paddingHorizontal: PAD, paddingVertical: V(14),
  borderTopWidth: 1,
  backgroundColor: DEFAULT_BG,
 },
 actionBtn: {
  flex: 1, flexDirection: 'row', alignItems: 'center',
  justifyContent: 'center', paddingVertical: V(12),
  borderRadius: 12, borderWidth: 1,
  backgroundColor: 'rgba(255,255,255,0.02)',
  borderColor: 'rgba(255,255,255,0.06)',
 },
 actionBtnText: { fontSize: S(13), fontWeight: '600', marginLeft: H(6) },
 logoutText: { color: '#E31B23' },
 deleteText: { color: SECONDARY },

 /* ── FLOATING BUTTONS ───────────────────────── */
 fab: {
  position: 'absolute', borderRadius: 28,
  justifyContent: 'center', alignItems: 'center', elevation: 6,
  shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3, shadowRadius: 8,
 },
 voucherFab: { bottom: V(105), right: H(16), width: 56, height: 56, backgroundColor: PRIMARY },
 liveFab: { bottom: V(170), left: H(16), width: 48, height: 48, backgroundColor: '#EF4444' },
 liveDot: { width: 10, height: 10, borderRadius: 5 },

 /* ── BOTTOM SHEET ───────────────────────────── */
 bottomTitle: { fontSize: S(15), fontWeight: '600', marginBottom: V(12) },
 bottomInput: {
  borderWidth: 1, borderRadius: 12,
  paddingHorizontal: H(14), paddingVertical: V(12),
  fontSize: S(14), marginTop: V(8),
 },
 bottomSaveBtn: {
  borderRadius: 12, paddingVertical: V(13),
  alignItems: 'center', marginTop: V(18),
  backgroundColor: PRIMARY,
 },
 bottomSaveBtnText: { color: '#fff', fontSize: S(15), fontWeight: '700' },
 chipRow: { flexDirection: 'row', gap: H(8), marginTop: V(8) },
 chip: {
  paddingHorizontal: H(16), paddingVertical: V(10),
  borderRadius: 10, borderWidth: 1,
 },

 /* ── SETTINGS TOGGLE ────────────────────────── */
 settingRow: {
  flexDirection: 'row', justifyContent: 'space-between',
  alignItems: 'center', paddingVertical: V(13),
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.03)',
 },
 settingInfo: { flex: 1, marginRight: H(10) },
 settingTitleRow: { flexDirection: 'row', alignItems: 'center' },
 settingIcon: { marginRight: H(10) },
 settingTitle: { color: DEFAULT_TEXT, fontSize: S(14), fontWeight: '600' },
 settingDesc: { color: DEFAULT_SUBTEXT, fontSize: S(12), marginTop: V(2), opacity: 0.8 },
 toggleWrap: { flexDirection: 'row', alignItems: 'center' },
 toggleLabel: { color: DEFAULT_SUBTEXT, marginRight: H(8), fontSize: S(13) },
 toggleTrack: {
  width: H(44), height: V(24), borderRadius: 12,
  padding: 2, justifyContent: 'center',
 },
 toggleThumb: {
  width: H(20), height: H(20), borderRadius: 10,
  backgroundColor: '#fff',
  shadowColor: '#000', shadowOpacity: 0.2,
  shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
  elevation: 2,
 },
 thumbOn: { alignSelf: 'flex-end' },

 /* ── MODALS ─────────────────────────────────── */
 modalHeader: {
  flexDirection: 'row', alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: PAD, paddingVertical: V(14),
  borderBottomWidth: 1,
 },
 modalTitle: {
  color: DEFAULT_TEXT, fontSize: S(17), fontWeight: '700',
  letterSpacing: 0.5,
 },
 modalClose: { color: PRIMARY, fontSize: S(16), fontWeight: '600' },
 modalBody: { flex: 1, padding: PAD },
 warningText: { color: DEFAULT_SUBTEXT, fontSize: S(12), marginTop: V(6) },
 logoutBtnRow: {
  flexDirection: 'row', alignItems: 'center',
  justifyContent: 'center', borderRadius: 12,
  padding: V(14), marginTop: V(20), borderWidth: 1,
 },

 /* ── BOTTOM SHEET ───────────────────────────── */
 bsSectionTitle: { fontSize: S(15), fontWeight: '600', marginBottom: V(10) },
 regionBtn: {
  flexDirection: 'row', justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.03)',
  borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  borderRadius: 12, padding: V(12), marginTop: V(8),
 },
 regionValue: { color: DEFAULT_TEXT, fontSize: S(14), fontWeight: '600', marginTop: V(4) },

 /* ── LOADING ────────────────────────────────── */
 loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center', alignItems: 'center',
 },
});
