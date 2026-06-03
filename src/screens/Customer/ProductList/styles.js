import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';

const DEFAULT_BG = '#0B0F19';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: horizontalScale(20), paddingVertical: verticalScale(15), borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, marginLeft: horizontalScale(15) },
  headerTitle: { color: '#fff', fontSize: moderateScale(18), fontWeight: 'bold' },
  headerSubtitle: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12) },
  cartBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  
  scrollContent: { paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(20) },
  resultsCount: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(20) },
  countText: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14) },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: horizontalScale(12), paddingVertical: verticalScale(6), borderRadius: Theme.radius.sm },
  filterText: { color: Theme.staticColors.primary, fontSize: moderateScale(13), fontWeight: '600', marginLeft: horizontalScale(6) },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrapper: { width: '48%', marginBottom: verticalScale(20) },
  productItemOpen: { backgroundColor: 'transparent' },
  productImageOpen: { width: '100%', height: verticalScale(110), borderRadius: 4 },
  productInfoOpen: { paddingVertical: verticalScale(10), alignItems: 'center' },
  productNameOpen: { color: '#fff', fontSize: moderateScale(14), fontWeight: 'bold', textAlign: 'center', marginBottom: verticalScale(4) },
  productPriceOpen: { color: Theme.staticColors.primary, fontSize: moderateScale(15), fontWeight: 'bold', textAlign: 'center' },
  
  emptyContainer: { alignItems: 'center', marginTop: verticalScale(100) },
  emptyText: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14) }
});
