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
  scrollContent: { 
    paddingHorizontal: horizontalScale(20), 
    paddingBottom: verticalScale(140) 
  },
  title: { 
    color: DEFAULT_TEXT, 
    fontSize: moderateScale(26), 
    fontWeight: 'bold', 
    marginTop: verticalScale(15), 
    marginBottom: verticalScale(20) 
  },
  
  profileHeader: { alignItems: 'center', marginBottom: verticalScale(25) },
  avatarWrapper: { position: 'relative' },
  avatar: { 
    width: horizontalScale(96), 
    height: horizontalScale(96), 
    borderRadius: horizontalScale(48), 
    borderWidth: 2, 
    borderColor: Theme.staticColors.primary, 
    backgroundColor: '#111111' 
  },
  vipBadge: { 
    position: 'absolute', 
    bottom: -2, 
    right: -2, 
    backgroundColor: '#F59E0B', 
    width: horizontalScale(28), 
    height: horizontalScale(28), 
    borderRadius: horizontalScale(14), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: DEFAULT_BG 
  },
  editBadge: { 
    position: 'absolute', 
    top: -2, 
    right: -2, 
    backgroundColor: Theme.staticColors.primary, 
    width: horizontalScale(28), 
    height: horizontalScale(28), 
    borderRadius: horizontalScale(14), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: DEFAULT_BG, 
    zIndex: 10 
  },
  userNameHeader: { 
    color: DEFAULT_TEXT, 
    fontSize: moderateScale(22), 
    fontWeight: 'bold', 
    marginTop: verticalScale(12) 
  },
  userStatus: { 
    color: DEFAULT_SUBTEXT, 
    fontSize: moderateScale(13), 
    marginTop: verticalScale(4), 
    opacity: 0.8 
  },
  
  cardWrapper: { marginBottom: verticalScale(25) },
  membershipCard: { 
    height: verticalScale(185), 
    borderRadius: Theme.radius.lg, 
    overflow: 'hidden', 
    padding: moderateScale(22), 
    elevation: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 20 
  },
  glare: { ...StyleSheet.absoluteFillObject, width: '200%', height: '200%', top: '-50%', left: '-50%' },
  cardContent: { flex: 1, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBrand: { color: 'rgba(255,255,255,0.6)', fontSize: moderateScale(10), fontWeight: 'bold', letterSpacing: 2 },
  cardTier: { color: '#fff', fontSize: moderateScale(18), fontWeight: '900', marginTop: verticalScale(4), letterSpacing: 1 },
  chip: { 
    width: horizontalScale(44), 
    height: verticalScale(30), 
    borderRadius: 8, 
    backgroundColor: 'rgba(255,255,255,0.12)', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.25)' 
  },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardHolder: { color: 'rgba(255,255,255,0.6)', fontSize: moderateScale(10), fontWeight: 'bold' },
  cardNumber: { color: '#fff', fontSize: moderateScale(14), fontWeight: '600', marginTop: verticalScale(4), letterSpacing: 2 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(25) },
  statItem: { 
    width: '48%', 
    paddingVertical: verticalScale(14), 
    paddingHorizontal: horizontalScale(10), 
    alignItems: 'center', 
    borderRadius: Theme.radius.md 
  },
  statLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), marginBottom: verticalScale(4) },
  statValue: { color: Theme.staticColors.primary, fontSize: moderateScale(18), fontWeight: 'bold' },
  
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: verticalScale(12), 
    marginTop: verticalScale(10) 
  },
  sectionLabel: { color: DEFAULT_TEXT, fontSize: moderateScale(17), fontWeight: 'bold' },
  sectionSubtitle: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(11) },
  
  menuGroup: { marginBottom: verticalScale(25) },
  infoRowWrapper: { marginBottom: verticalScale(10) },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: verticalScale(15), 
    paddingHorizontal: horizontalScale(16), 
    borderRadius: Theme.radius.md 
  },
  infoLeft: { flex: 1 },
  infoTitle: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), fontWeight: '500' },
  infoValue: { color: DEFAULT_TEXT, fontSize: moderateScale(15), fontWeight: '600', marginTop: verticalScale(4) },
  infoRight: { flexDirection: 'row', alignItems: 'center' },
  
  settingsCard: { padding: moderateScale(10), borderRadius: Theme.radius.lg },
  settingRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: verticalScale(14), 
    paddingHorizontal: horizontalScale(15), 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.03)' 
  },
  settingRowLast: { borderBottomWidth: 0 },
  settingInfo: { flex: 1, marginRight: horizontalScale(10) },
  settingTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(15), fontWeight: 'bold' },
  settingDesc: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(12), marginTop: verticalScale(2), opacity: 0.8 },
  
  toggle: { 
    width: horizontalScale(46), 
    height: verticalScale(26), 
    borderRadius: 13, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    padding: 3, 
    justifyContent: 'center' 
  },
  toggleOn: { backgroundColor: Theme.staticColors.primary },
  toggleDot: { 
    width: horizontalScale(20), 
    height: horizontalScale(20), 
    borderRadius: horizontalScale(10), 
    backgroundColor: '#fff' 
  },
  toggleDotOn: { alignSelf: 'flex-end' },
  
  dangerSpacer: { height: verticalScale(25) },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: verticalScale(15), 
    height: verticalScale(54), 
    borderRadius: Theme.radius.md, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.06)', 
    backgroundColor: 'rgba(255,255,255,0.01)' 
  },
  logoutText: { color: DEFAULT_TEXT, fontWeight: 'bold', fontSize: moderateScale(15), marginLeft: horizontalScale(10) },
  deleteBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: verticalScale(12), 
    height: verticalScale(54), 
    borderRadius: Theme.radius.md, 
    borderWidth: 1, 
    borderColor: 'rgba(220,38,38,0.2)', 
    backgroundColor: 'rgba(220,38,38,0.02)' 
  },
  deleteText: { color: Theme.staticColors.secondary, fontWeight: 'bold', fontSize: moderateScale(15), marginLeft: horizontalScale(10) },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' },
  avatarModalSheet: { 
    backgroundColor: '#050505', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: moderateScale(22), 
    paddingBottom: verticalScale(50), 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)' 
  },
  modalHandle: { 
    width: horizontalScale(40), 
    height: verticalScale(4), 
    borderRadius: 2, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    alignSelf: 'center', 
    marginBottom: verticalScale(22) 
  },
  modalTitle: { color: DEFAULT_TEXT, fontSize: moderateScale(19), fontWeight: 'bold', marginBottom: verticalScale(20), textAlign: 'center' },
  
  avatarActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(22) },
  avatarActionButton: { 
    width: '48%', 
    height: verticalScale(48), 
    borderRadius: Theme.radius.md, 
    backgroundColor: 'rgba(255,255,255,0.04)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)' 
  },
  avatarActionText: { color: DEFAULT_TEXT, fontWeight: '600', fontSize: moderateScale(13), marginLeft: horizontalScale(8) },

  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  avatarOption: { 
    width: '29%', 
    aspectRatio: 1, 
    borderRadius: Theme.radius.md, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: moderateScale(8), 
    marginBottom: verticalScale(14), 
    borderWidth: 2, 
    borderColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  selectedAvatarOption: { borderColor: Theme.staticColors.primary, backgroundColor: 'rgba(59,130,246,0.15)' },
  avatarOptionImg: { width: '100%', height: '100%', borderRadius: Theme.radius.sm },
  
  formContainer: { width: '100%', paddingVertical: verticalScale(5) },
  formLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(13), fontWeight: '600', marginBottom: verticalScale(8), marginTop: verticalScale(5) },
  formInputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: Theme.radius.md, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)', 
    paddingHorizontal: horizontalScale(15), 
    marginBottom: verticalScale(18) 
  },
  formInput: { flex: 1, color: DEFAULT_TEXT, fontSize: moderateScale(15), paddingVertical: verticalScale(12) },
  formInputIcon: { marginRight: horizontalScale(10) },
  
  tabSelector: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: Theme.radius.md, 
    padding: 4, 
    marginBottom: verticalScale(18), 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)' 
  },
  tabOption: { flex: 1, paddingVertical: verticalScale(12), alignItems: 'center', borderRadius: 10 },
  activeTabOption: { backgroundColor: Theme.staticColors.primary },
  tabOptionText: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(13), fontWeight: 'bold' },
  activeTabOptionText: { color: '#fff' },

  regionGroup: { marginBottom: verticalScale(18) },
  regionSelectButton: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderColor: 'rgba(255,255,255,0.08)', 
    borderWidth: 1, 
    borderRadius: Theme.radius.md, 
    padding: moderateScale(12), 
    marginBottom: verticalScale(10) 
  },
  regionSelectLabel: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(11) },
  regionSelectValue: { color: DEFAULT_TEXT, fontSize: moderateScale(14), fontWeight: '600', marginTop: verticalScale(4) },
  
  regionList: { maxHeight: verticalScale(140), backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: Theme.radius.md, padding: 5, marginBottom: verticalScale(12) },
  regionItem: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(15), borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)' },
  regionItemText: { color: DEFAULT_SUBTEXT, fontSize: moderateScale(14) },
  regionItemTextActive: { color: Theme.staticColors.primary, fontWeight: 'bold' },

  licenseImageContainer: { 
    height: verticalScale(150), 
    borderRadius: Theme.radius.md, 
    overflow: 'hidden', 
    backgroundColor: 'rgba(255,255,255,0.02)', 
    borderWidth: 1, 
    borderStyle: 'dashed', 
    borderColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginVertical: verticalScale(14) 
  },
  licenseImage: { width: '100%', height: '100%' },
  licenseUploadBtn: { alignItems: 'center' },
  licenseUploadText: { color: Theme.staticColors.primary, fontSize: moderateScale(13), fontWeight: '600', marginTop: verticalScale(6) },

  stickyButtonWrapper: { marginTop: verticalScale(10) },
  primaryButton: { 
    height: verticalScale(50), 
    borderRadius: Theme.radius.md, 
    backgroundColor: Theme.staticColors.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: Theme.staticColors.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5 
  },
  primaryButtonText: { color: '#fff', fontSize: moderateScale(15), fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: 'rgba(255,255,255,0.08)' },
  buttonDisabledText: { color: 'rgba(255,255,255,0.3)' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(10),
    backgroundColor: DEFAULT_BG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)'
  },
  topBarTitle: {
    color: '#fff',
    fontSize: moderateScale(17),
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  settingsIconWrapper: {
    width: horizontalScale(36),
    height: horizontalScale(36),
    borderRadius: horizontalScale(18),
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  shopeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: moderateScale(16),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  shopeeAvatarWrapper: {
    position: 'relative',
    marginRight: horizontalScale(16)
  },
  shopeeAvatar: {
    width: horizontalScale(70),
    height: horizontalScale(70),
    borderRadius: horizontalScale(35),
    borderWidth: 2,
    borderColor: Theme.staticColors.primary,
    backgroundColor: '#111111'
  },
  shopeeCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Theme.staticColors.primary,
    width: horizontalScale(22),
    height: horizontalScale(22),
    borderRadius: horizontalScale(11),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: DEFAULT_BG
  },
  shopeeHeaderText: {
    flex: 1,
    justifyContent: 'center'
  },
  shopeeName: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  shopeeTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245,158,11,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: verticalScale(6)
  },
  shopeeTierText: {
    color: '#F59E0B',
    fontSize: moderateScale(10),
    fontWeight: 'bold'
  },
  shopeeUid: {
    color: DEFAULT_SUBTEXT,
    fontSize: moderateScale(11),
    marginTop: verticalScale(4),
    opacity: 0.8
  },
  walletBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 14,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(14),
    marginBottom: verticalScale(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  walletItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  walletDivider: {
    width: 1,
    height: verticalScale(22),
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: horizontalScale(12)
  },
  walletLabel: {
    color: DEFAULT_SUBTEXT,
    fontSize: moderateScale(10),
    fontWeight: '500'
  },
  walletValue: {
    color: DEFAULT_TEXT,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    marginTop: verticalScale(1)
  },
  blockContainer: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 16,
    padding: moderateScale(15),
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    width: '100%'
  },
  blockTitle: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    letterSpacing: 0.8,
    marginBottom: verticalScale(12),
    opacity: 0.9
  },
  shopeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shopeeCol: {
    alignItems: 'center',
    width: '23%'
  },
  iconCircle: {
    width: horizontalScale(46),
    height: horizontalScale(46),
    borderRadius: horizontalScale(23),
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative'
  },
  glowBorder: {
    borderColor: '#E31B23',
    shadowColor: '#E31B23',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3
  },
  iconLabel: {
    color: DEFAULT_SUBTEXT,
    fontSize: moderateScale(11),
    textAlign: 'center',
    marginTop: verticalScale(8)
  },
  redBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  redBadgeText: {
    color: '#fff',
    fontSize: moderateScale(8),
    fontWeight: 'bold'
  },
  blueBadgeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E31B23',
    borderWidth: 1.5,
    borderColor: '#050505'
  },
  listIconCircle: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: horizontalScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12)
  },
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(236,72,153,0.06)',
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(18),
    borderWidth: 1,
    borderColor: 'rgba(236,72,153,0.15)',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(30)
  }
});

