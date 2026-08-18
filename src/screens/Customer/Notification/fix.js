const fs = require('fs');
const file = 'd:/DATN/AnhEmMotor/AnhEmMotor-Mobile/src/screens/Customer/Notification/NotificationScreen.js';
let content = fs.readFileSync(file, 'utf8');

let tabIndex = content.indexOf("{ id: 'service', label:");
if (tabIndex !== -1) {
    let tabEnd = content.indexOf("},", tabIndex);
    content = content.substring(0, tabIndex) + "{ id: 'news', label: '📰 Tin tức mới nhất' }" + content.substring(tabEnd + 1);
}

let serviceContentIndex = content.indexOf("logic.activeTab === 'service' ? (");
if (serviceContentIndex !== -1) {
    let loyaltyContentIndex = content.indexOf("logic.activeTab === 'loyalty' ? (", serviceContentIndex);
    const newsHtml = `logic.activeTab === 'news' ? (
            <View style={{ paddingHorizontal: 16 }}>
              {logic.isLoadingNews ? (
                <ActivityIndicator size="large" color={Theme.staticColors.primary} style={{ marginTop: 50 }} />
              ) : logic.newsList && logic.newsList.length > 0 ? (
                logic.newsList.map((item, index) => (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[
                      styles.historyItemCard,
                      { backgroundColor: activeColors.cardBg, borderColor: activeColors.border, marginBottom: 10, padding: 12, flexDirection: 'row', alignItems: 'flex-start' },
                    ]}
                    onPress={() => navigation.navigate('NewsDetail', { slug: item.slug })}
                  >
                    <View style={{ marginRight: 10, marginTop: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 8, borderRadius: 10 }}>
                      <FileText color={Theme.staticColors.primary} size={20} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ marginBottom: 4 }}>
                        <Text style={[styles.historyPartsTitle, { color: Theme.staticColors.primary, fontSize: 11, fontWeight: 'bold' }]}>
                          {item.categoryName || 'Tin tức'} • {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString('vi-VN') : ''}
                        </Text>
                      </View>
                      <Text style={[styles.historyServiceTitle, { color: activeColors.text, fontSize: 15, fontWeight: '600', marginBottom: 4 }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.historyGarage, { color: activeColors.subtext, fontSize: 13 }]} numberOfLines={2}>
                        {item.excerpt}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                  <Text style={{ color: activeColors.subtext }}>Hiện chưa có tin tức nào mới.</Text>
                </View>
              )}
            </View>
          ) : `;
    content = content.substring(0, serviceContentIndex) + newsHtml + content.substring(loyaltyContentIndex);
}

// Replace the voucher and birthday cards
// We look for:
// <Animated.View
//   entering={FadeInDown.duration(500).delay(100)}
//   style={styles.loyaltyVoucherCard}
// >
let voucherCardIndex = content.indexOf("<Animated.View\n              entering={FadeInDown.duration(500).delay(100)}\n              style={styles.loyaltyVoucherCard}");
if (voucherCardIndex === -1) {
    // try different formatting
    voucherCardIndex = content.indexOf("style={styles.loyaltyVoucherCard}");
    if (voucherCardIndex !== -1) {
        voucherCardIndex = content.lastIndexOf("<Animated.View", voucherCardIndex);
    }
}

let referralCardIndex = content.indexOf("style={styles.loyaltyReferralCard}");
if (referralCardIndex !== -1) {
    referralCardIndex = content.lastIndexOf("<Animated.View", referralCardIndex);
}

if (voucherCardIndex !== -1 && referralCardIndex !== -1) {
    const vouchersHtml = `{logic.isLoadingVoucher ? (
              <ActivityIndicator size="large" color={Theme.staticColors.primary} style={{ marginTop: 30 }} />
            ) : logic.voucherList && logic.voucherList.length > 0 ? (
              logic.voucherList.map((voucher, index) => {
                const isPercent = voucher.discountType === 0 || voucher.discountType === 'Percent';
                const valueText = isPercent ? \`\${voucher.discountValue}%\` : \`\${voucher.discountValue / 1000}K\`;

                return (
                  <Animated.View
                    key={voucher.id || index}
                    entering={FadeInDown.duration(500).delay(100 + index * 50)}
                    style={styles.loyaltyVoucherCard}
                  >
                    <View style={styles.loyaltyVoucherHeader}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 }}
                      >
                        <Gift
                          color={Theme.staticColors.primary}
                          size={18}
                          style={{ marginRight: 6, flexShrink: 0 }}
                        />
                        <Text
                          style={[styles.loyaltyVoucherTitle, { flex: 1 }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {voucher.name || 'Voucher Đặc Quyền'}
                        </Text>
                      </View>
                      <View style={styles.voucherUrgentBadge}>
                        <Text style={styles.voucherUrgentBadgeText}>HSD: {new Date(voucher.validTo).toLocaleDateString('vi-VN')}</Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.dashedVoucherBody,
                        {
                          backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                          borderColor: activeColors.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.dashedVoucherLeft,
                          {
                            backgroundColor: isDark
                              ? 'rgba(59, 130, 246, 0.1)'
                              : 'rgba(59, 130, 246, 0.05)',
                            borderRightColor: activeColors.border,
                          },
                        ]}
                      >
                        <Text style={styles.voucherValBig}>{valueText}</Text>
                        <Text style={styles.voucherValLabel}>GIẢM</Text>
                      </View>
                      <View style={styles.dashedVoucherRight}>
                        <Text style={[styles.voucherNameTitle, { color: activeColors.text }]}>
                          {voucher.name}
                        </Text>
                        <Text style={[styles.voucherCodeLabel, { color: activeColors.subtext }]}>
                          MÃ: {voucher.code}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.loyaltyVoucherDesc, { color: activeColors.text }]}>
                      Voucher giảm {isPercent ? \`\${voucher.discountValue}%\` : \`\${voucher.discountValue.toLocaleString()} VNĐ\`}. Áp dụng cho đơn từ {(voucher.minOrderValue || 0).toLocaleString()} VNĐ.
                    </Text>

                    <TouchableOpacity
                      style={[styles.loyaltyCtaButton, { backgroundColor: Theme.staticColors.primary }]}
                      onPress={() => logic.setActiveModal('voucher')}
                    >
                      <Text style={styles.loyaltyCtaText}>Sử dụng ngay 🎟️</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })
            ) : (
              <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 30 }}>
                <Text style={{ color: activeColors.subtext }}>Bạn chưa có voucher nào.</Text>
              </View>
            )}

            {}
            `;
            
    // The previous code had empty {} braces around components.
    // I need to ensure I remove from before the voucher card's Animated.View until before the referral card's Animated.View
    // Wait, the index of <Animated.View for voucherCard is exactly where I should start replacing.
    // And referralCardIndex is where I should end replacing.
    
    // check if there is a {} before voucherCardIndex that I should also replace?
    let beforeVoucher = content.lastIndexOf("{}", voucherCardIndex);
    if (beforeVoucher !== -1 && (voucherCardIndex - beforeVoucher) < 50) {
        voucherCardIndex = beforeVoucher;
    }
    
    content = content.substring(0, voucherCardIndex) + vouchersHtml + content.substring(referralCardIndex);
} else {
    console.log("Could not find voucher or referral card");
}

fs.writeFileSync(file, content);
console.log("Replaced successfully.");
