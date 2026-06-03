import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';

const { width } = Dimensions.get('window');

// Use dark theme as default fallback since background colors are dynamic
const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#111111';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';

export const styles = StyleSheet.create({
  container: { flex: 1, minHeight: '100vh', backgroundColor: DEFAULT_BG },
  scrollView: { flex: 1, minHeight: '100vh' },
  scrollContent: { paddingBottom: 100 },
  
  // Header / Image Area
  header: { height: verticalScale(380), backgroundColor: '#fff', position: 'relative', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' },
  imageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '90%', height: '70%' },
  backBtn: { position: 'absolute', top: verticalScale(50), left: horizontalScale(20), width: 44, height: 44, borderRadius: 22, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  rotationBadge: { position: 'absolute', bottom: verticalScale(20), flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  rotationText: { color: '#fff', fontSize: 11, marginLeft: 6, fontWeight: 'bold' },

  // Content Area
  content: { paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(25) },
  
  // Title & Price Section
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: verticalScale(15) },
  name: { color: DEFAULT_TEXT, fontSize: moderateScale(24), fontWeight: 'bold', flex: 1, marginRight: 15 },
  category: { fontSize: moderateScale(13), fontWeight: '500', marginTop: 4 },
  priceContainer: { alignItems: 'flex-end' },
  price: { color: Theme.staticColors.primary, fontSize: moderateScale(22), fontWeight: 'bold' },
  msrp: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(13), textDecorationLine: 'line-through', marginTop: 2 },
  
  statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: verticalScale(20) },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  statusText: { color: '#10B981', fontSize: moderateScale(11), fontWeight: 'bold' },

  // Color Picker
  colorSection: { marginBottom: verticalScale(25) },
  colorGrid: { flexDirection: 'row', alignItems: 'center' },
  colorCircle: { width: 34, height: 34, borderRadius: 17, marginRight: 15, borderWidth: 2, borderColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  activeColorCircle: { borderColor: Theme.staticColors.primary },
  colorInner: { width: 24, height: 24, borderRadius: 12 },

  // Loyalty Reward
  rewardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: moderateScale(15), borderRadius: Theme.radius.md, marginBottom: verticalScale(25), borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  rewardText: { color: '#fff', fontSize: moderateScale(13), marginLeft: 10, flex: 1 },
  rewardHighlight: { color: Theme.staticColors.primary, fontWeight: 'bold' },

  tabBarScroll: { marginBottom: verticalScale(20) },
  tabBarContent: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 4, alignItems: 'center' },
  tab: { paddingHorizontal: horizontalScale(18), paddingVertical: 10, alignItems: 'center', borderRadius: 12, marginHorizontal: 2 },
  activeTab: { backgroundColor: DEFAULT_CARD },
  tabText: { color: DEFAULT_SUBTEXT, fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },
  activeTabText: { color: Theme.staticColors.primary },

  // Overview Tab
  sectionTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(18), fontWeight: 'bold', marginBottom: verticalScale(15) },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: verticalScale(25) },
  featureCard: { width: '48%', backgroundColor: DEFAULT_CARD, padding: moderateScale(15), borderRadius: Theme.radius.md, marginBottom: verticalScale(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  featureIcon: { marginBottom: 10 },
  featureTitle: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold', marginBottom: 4 },
  featureDesc: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(11), lineHeight: 16 },

  financeTeaser: { backgroundColor: 'rgba(255,255,255,0.03)', padding: moderateScale(20), borderRadius: Theme.radius.md, marginBottom: verticalScale(30) },
  teaserTitle: { color: '#fff', fontSize: moderateScale(15), fontWeight: 'bold', marginBottom: 8 },
  teaserDesc: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(13), marginBottom: 12 },
  teaserLink: { color: Theme.staticColors.primary, fontWeight: 'bold', fontSize: moderateScale(13) },

  // Specs Tab
  specGroup: { marginBottom: verticalScale(25) },
  specGroupTitle: { color: Theme.staticColors.primary, fontSize: moderateScale(15), fontWeight: 'bold', marginBottom: verticalScale(8) },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: verticalScale(6), borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  specLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14) },
  specValue: { color: '#fff', fontSize: moderateScale(14), fontWeight: '600', maxWidth: '60%', textAlign: 'right' },

  // Finance Tab
  calculator: { marginBottom: verticalScale(30) },
  calcLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14), marginBottom: 15 },
  calcValue: { color: Theme.staticColors.primary, fontWeight: 'bold' },
  slider: { width: '100%', height: 40, marginBottom: 20 },
  resultCard: { backgroundColor: DEFAULT_CARD, padding: moderateScale(20), borderRadius: Theme.radius.md, marginBottom: 25 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  resultLabel: { color: DEFAULT_SUBTEXT, fontSize: 14, flex: 1, marginRight: 10 },
  monthlyPayment: { color: '#FFB800', fontSize: moderateScale(18), fontWeight: 'bold', textAlign: 'right' },
  partners: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 20 },
  partnerLogo: { width: 60, height: 30, opacity: 0.6 },

  checklist: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: Theme.staticColors.primary },
  checkItem: { color: DEFAULT_SUBTEXT, fontSize: 13, marginBottom: 8 },

  // Review Tab
  ratingSummary: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avgScore: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginRight: 20 },
  filterTag: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  filterTagText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  reviewItem: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: Theme.radius.md, marginBottom: 15 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  reviewerName: { color: '#fff', fontWeight: 'bold' },
  verifiedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  verifiedText: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },
  reviewContent: { color: DEFAULT_SUBTEXT, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  showroomReply: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, marginTop: 5 },
  replyTitle: { color: Theme.staticColors.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  replyContent: { color: DEFAULT_SUBTEXT, fontSize: 12, fontStyle: 'italic' },

  // Gallery Tab
  galleryContainer: { marginBottom: verticalScale(25) },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: verticalScale(15) },
  galleryItem: { width: '48%', height: verticalScale(120), borderRadius: 12, overflow: 'hidden', marginBottom: verticalScale(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', position: 'relative' },
  galleryItemLarge: { width: '100%', height: verticalScale(200), marginBottom: verticalScale(15) },
  galleryImage: { width: '100%', height: '100%' },
  galleryOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', paddingHorizontal: 10, paddingVertical: 6 },
  galleryTag: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Sticky Bottom Actions
  stickyActions: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: DEFAULT_BG, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  secondaryBtn: { flex: 1, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 15 },
  primaryBtn: { flex: 1.5, height: 55, borderRadius: 15, overflow: 'hidden' },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});

