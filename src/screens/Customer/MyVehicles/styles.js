import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/Theme';

const { width } = Dimensions.get('window');

const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#111111';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';
const DEFAULT_BORDER = 'rgba(255, 255, 255, 0.06)';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },
  scrollContent: { padding: Theme.spacing.lg },
  header: { marginTop: Theme.spacing.xl + 20, marginBottom: 30, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15, padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
  title: { color: DEFAULT_TEXT, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: DEFAULT_SUBTEXT, fontSize: 13, marginTop: 4, fontWeight: '500' },
  
  profileSection: { marginBottom: 30 },
  bikeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  bikeInfo: { flex: 1, marginRight: 15 },
  bikeName: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  bikePlate: { color: Theme.staticColors.primary, fontSize: 14, fontWeight: '600', marginTop: 2 },
  
  bikeImageContainer: { position: 'relative' },
  bikeThumb: { width: 110, height: 110 },
  qrBadge: { position: 'absolute', right: -5, bottom: -5, backgroundColor: Theme.staticColors.primary, padding: 8, borderRadius: 12, borderWidth: 3, borderColor: DEFAULT_BG },

  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.12)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 15 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.staticColors.success, marginRight: 8 },
  statusText: { color: Theme.staticColors.success, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

  detailGrid: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 25, marginTop: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  detailItem: { flex: 1 },
  detailLabel: { color: DEFAULT_SUBTEXT, fontSize: 12, fontWeight: '500', marginBottom: 8 },
  detailValueRow: { flexDirection: 'row', alignItems: 'center' },
  detailValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '400' },
  detailDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 5 },

  openSection: { marginTop: 45 },
  sectionTitle: { color: DEFAULT_TEXT, fontSize: 20, fontWeight: '900', marginBottom: 25 },

  warrantyMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  warrantyLabel: { color: DEFAULT_SUBTEXT, fontSize: 15, fontWeight: '400' },
  warrantyDays: { color: '#FFFFFF', fontSize: 42, fontWeight: '900', marginTop: 10 },
  daysUnit: { fontSize: 18, fontWeight: '400', color: DEFAULT_SUBTEXT },
  
  warrantyPeriod: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 25, marginTop: 30 },
  periodItem: { flex: 1 },
  periodLabel: { color: DEFAULT_SUBTEXT, fontSize: 12, marginBottom: 8, fontWeight: '500' },
  periodValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '400' },
  periodDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 20 },
  
  insuranceSection: { marginTop: 30, padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderLeftWidth: 4, borderLeftColor: Theme.staticColors.success },
  insuranceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  insuranceLabel: { color: DEFAULT_SUBTEXT, fontSize: 12, fontWeight: '500', marginBottom: 6 },
  insuranceStatus: { color: '#FFFFFF', fontSize: 15, fontWeight: '400' },
  buyInsuranceBtn: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buyInsuranceText: { color: Theme.staticColors.success, fontSize: 13, fontWeight: '700' },

  specList: { marginTop: 10 },
  specItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  specIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(0,122,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  specInfo: { flex: 1 },
  specLabel: { color: DEFAULT_SUBTEXT, fontSize: 11, marginBottom: 6, fontWeight: '500' },
  specValue: { color: '#FFFFFF', fontSize: 15, fontWeight: '400', lineHeight: 22 },

  predictionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  predictionHighlight: { flexDirection: 'row', alignItems: 'center' },
  predictionMeta: { marginLeft: 15 },
  predictionTarget: { color: '#FFFFFF', fontSize: 18, fontWeight: '400' },
  predictionDate: { color: Theme.staticColors.primary, fontSize: 14, fontWeight: '500' },
  bookNowBtnOpen: { backgroundColor: Theme.staticColors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: Theme.radius.full },
  bookNowText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  predictionBodyOpen: { padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 18, marginTop: 10 },
  predictionLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '400', lineHeight: 20, opacity: 0.9 },

  timelineItem: { flexDirection: 'row', marginBottom: 25 },
  timelineLeft: { alignItems: 'center', width: 30, marginRight: 10 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Theme.staticColors.primary, zIndex: 2 },
  timelineLine: { flex: 1, width: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 5 },
  timelineRight: { flex: 1 },
  timelineCardOpen: { padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20 },
  timelineDate: { color: '#FFFFFF', fontSize: 14, fontWeight: '400' },
  timelineActions: { flexDirection: 'row', alignItems: 'center' },
  timelineType: { color: Theme.staticColors.primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginRight: 4 },
  timelineDesc: { color: '#E4E7EC', fontSize: 15, marginBottom: 20, lineHeight: 24, fontWeight: '400' },
  timelineFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  timelineTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  timelineTagText: { color: DEFAULT_SUBTEXT, fontSize: 11, marginLeft: 4, fontWeight: '400' },
  timelineRightInfo: { alignItems: 'flex-end' },
  timelinePrice: { color: '#FFFFFF', fontSize: 16, fontWeight: '400', marginBottom: 6 },
  invoiceBtn: { paddingVertical: 4 },
  invoiceText: { color: Theme.staticColors.primary, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: DEFAULT_CARD, width: width * 0.85, padding: 30, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: DEFAULT_BORDER },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 25 },
  qrContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 25 },
  qrDesc: { color: DEFAULT_SUBTEXT, textAlign: 'center', fontSize: 14, lineHeight: 20, marginBottom: 30 },
  closeBtn: { backgroundColor: Theme.staticColors.primary, width: '100%', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

