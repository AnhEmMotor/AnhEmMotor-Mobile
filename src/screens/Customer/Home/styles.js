import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';

const { width } = Dimensions.get('window');

// Use dark theme as default fallback since background colors are dynamic
const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#1E293B';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';
const DEFAULT_BORDER = 'rgba(255, 255, 255, 0.06)';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },
  scrollContent: { paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(10) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(25) },
  headerLeft: { flex: 1, paddingRight: horizontalScale(15) },
  greeting: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14) },
  userName: { color: DEFAULT_TEXT, fontSize: moderateScale(22), fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: horizontalScale(44), height: horizontalScale(44), borderRadius: horizontalScale(22), backgroundColor: DEFAULT_CARD, justifyContent: 'center', alignItems: 'center', marginLeft: horizontalScale(10) },
  avatar: { width: horizontalScale(44), height: horizontalScale(44), borderRadius: horizontalScale(22), borderWidth: 1, borderColor: Theme.staticColors.primary },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: Theme.staticColors.error, minWidth: moderateScale(18), height: moderateScale(18), borderRadius: moderateScale(9), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: DEFAULT_CARD },
  badgeText: { color: '#fff', fontSize: moderateScale(10), fontWeight: 'bold' },
  
  vehicleModule: { marginBottom: verticalScale(30) },
  carouselContainer: { 
    width: width, 
    height: verticalScale(205), 
    marginHorizontal: -20,
    overflow: 'hidden', 
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  carouselScroll: { flex: 1 },
  bannerItem: { 
    height: '100%', 
    position: 'relative',
    overflow: 'hidden'
  },
  bannerImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover',
    position: 'absolute'
  },
  bannerGradient: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: '100%', 
    justifyContent: 'flex-end', 
    paddingHorizontal: 20,
    paddingBottom: verticalScale(25)
  },
  bannerBadge: { 
    alignSelf: 'flex-start', 
    backgroundColor: 'rgba(59, 130, 246, 0.25)', 
    borderWidth: 1, 
    borderColor: '#3B82F6', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8, 
    marginBottom: verticalScale(8) 
  },
  bannerBadgeText: { 
    color: '#3B82F6', 
    fontSize: moderateScale(10), 
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },
  bannerTitle: { 
    color: '#fff', 
    fontSize: moderateScale(17), 
    fontWeight: 'bold', 
    marginBottom: verticalScale(6),
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  bannerSub: { 
    color: 'rgba(255,255,255,0.75)', 
    fontSize: moderateScale(12), 
    lineHeight: moderateScale(16),
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  paginationDots: { 
    position: 'absolute', 
    bottom: verticalScale(12), 
    left: 0,
    right: 0,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center' 
  },
  dot: { 
    height: 6, 
    borderRadius: 3, 
    marginHorizontal: 3.5 
  },
  activeDot: {
    width: 16,
    backgroundColor: Theme.staticColors.primary
  },
  inactiveDot: { 
    width: 6, 
    backgroundColor: 'rgba(255,255,255,0.4)' 
  },
  
  shortcutCard: { 
    marginTop: verticalScale(15), 
    padding: 0, 
    borderRadius: Theme.radius.lg,
  },
  shortcutRowContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: horizontalScale(10), 
    paddingVertical: verticalScale(15) 
  },
  shortcutItem: { alignItems: 'center', flex: 1 },
  shortcutIconBg: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: horizontalScale(22),
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(6)
  },
  shortcutText: { color: DEFAULT_TEXT, fontSize: moderateScale(11), fontWeight: '600' },

  deliveryCard: { padding: moderateScale(24), borderRadius: Theme.radius.lg, overflow: 'hidden' },
  deliveryTitle: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14), marginBottom: verticalScale(4) },
  deliveryVehicle: { color: DEFAULT_TEXT, fontSize: moderateScale(18), fontWeight: 'bold', marginBottom: verticalScale(20) },
  progressTrack: { height: verticalScale(8), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: verticalScale(12) },
  progressBar: { height: '100%', backgroundColor: Theme.staticColors.success, borderRadius: 4 },
  progressStatus: { flexDirection: 'row', justifyContent: 'space-between' },
  progressStep: { color: DEFAULT_TEXT, fontSize: moderateScale(13), flex: 1 },
  progressEstimate: { color: Theme.staticColors.success, fontSize: moderateScale(13), fontWeight: 'bold' },
  
  alertModule: { marginBottom: verticalScale(30) },
  sectionTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(18), fontWeight: 'bold', marginBottom: verticalScale(15) },
  alertCard: { marginBottom: verticalScale(12), borderLeftWidth: 3 },
  alertCardInner: { flexDirection: 'row', alignItems: 'flex-start', padding: moderateScale(14) },
  alertIcon: { marginTop: verticalScale(2) },
  alertContent: { flex: 1, marginLeft: horizontalScale(10) },
  alertTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(14), fontWeight: 'bold', marginBottom: verticalScale(2) },
  alertDesc: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), lineHeight: moderateScale(16), marginBottom: verticalScale(8) },
  alertCta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' },
  alertCtaText: { fontSize: moderateScale(12), fontWeight: 'bold', marginRight: horizontalScale(4) },
  
  voucherModule: { marginBottom: verticalScale(30) },
  voucherGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  voucherCardWrapper: { width: '48%', height: verticalScale(140), marginBottom: verticalScale(15) },
  voucherCard: { borderRadius: Theme.radius.md, height: '100%' },
  voucherCardInner: { padding: moderateScale(16), height: '100%', justifyContent: 'space-between' },
  voucherTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(12) },
  voucherTextContainer: { flex: 1 },
  voucherTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(14), fontWeight: 'bold', marginBottom: verticalScale(4) },
  voucherDesc: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), lineHeight: moderateScale(16) },
  
  exploreModule: { marginBottom: verticalScale(30) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(15) },
  viewAll: { color: Theme.staticColors.primary, fontSize: moderateScale(13), fontWeight: '600' },
  exploreGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  exploreItem: { width: '48%', height: verticalScale(160), borderRadius: Theme.radius.md, overflow: 'hidden', marginBottom: verticalScale(15) },
  exploreImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  exploreGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: verticalScale(80), justifyContent: 'flex-end', padding: moderateScale(12) },
  exploreCat: { color: Theme.staticColors.primary, fontSize: moderateScale(10), fontWeight: 'bold', marginBottom: verticalScale(2) },
  exploreTitle: { color: '#fff', fontSize: moderateScale(13), fontWeight: 'bold' },
  
  blogModule: { marginBottom: verticalScale(20) },
  blogItem: { marginBottom: verticalScale(12) },
  blogCard: { borderRadius: Theme.radius.md },
  blogCardInner: { flexDirection: 'row', alignItems: 'center', padding: moderateScale(12) },
  newsImage: { width: horizontalScale(80), height: horizontalScale(80), borderRadius: Theme.radius.sm, marginRight: horizontalScale(12) },
  blogInfo: { flex: 1 },
  blogTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(15), fontWeight: 'bold', marginBottom: verticalScale(4) },
  blogDesc: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), lineHeight: moderateScale(16), marginBottom: verticalScale(6) },
  blogMeta: { color: Theme.staticColors.primary, fontSize: moderateScale(10), fontWeight: '600' },

  bsContent: { alignItems: 'center', paddingVertical: verticalScale(20) },
  qrLargeBox: { backgroundColor: '#fff', padding: moderateScale(20), borderRadius: Theme.radius.lg, marginBottom: verticalScale(20) },
  bsTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(20), fontWeight: 'bold', marginBottom: verticalScale(8), textAlign: 'center' },
  bsDesc: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14), textAlign: 'center', marginBottom: verticalScale(30), paddingHorizontal: horizontalScale(20) },
  bsCodeBox: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: horizontalScale(30), paddingVertical: verticalScale(15), borderRadius: Theme.radius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', width: '100%' },
  bsCodeLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), marginBottom: verticalScale(4), letterSpacing: 1 },
  bsCodeValue: { color: Theme.staticColors.primary, fontSize: moderateScale(24), fontWeight: '900', letterSpacing: 2 }
});
