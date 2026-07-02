import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView from '../../components/map/MapView';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  RefreshCw,
  User,
  MapPin,
  WifiOff,
} from 'lucide-react-native';
import { Theme, useTheme } from '../../theme/Theme';
import { useNavigation } from '@react-navigation/native';
import {
  getActiveShipments,
  getShipmentTracking,
  transformActiveShipmentToMapFormat,
  transformTrackingResponseToMapFormat,
} from '../../api/logistics';

const { height } = Dimensions.get('window');

// Keep mock data as fallback
const mockDeliveryData = {
  orders: [
    {
      id: 'ORD001',
      customerName: 'Nguyễn Văn A',
      phone: '0901234567',
      status: 'in_transit',
      progress: 65,
      route: [
        { latitude: 10.8231, longitude: 106.6297, label: 'Kho chính - Q.10' },
        { latitude: 10.8396, longitude: 106.6609, label: 'Khách hàng 1 - Q.1' },
        { latitude: 10.8506, longitude: 106.6822, label: 'Khách hàng 2 - Q.3' },
      ],
      currentLocation: { latitude: 10.8396, longitude: 106.6609 },
      estimatedArrival: '14:30',
      items: [
        { name: 'Nhớt Castrol 1L', quantity: 2 },
        { name: 'Lọc gió Honda', quantity: 1 }
      ]
    },
    {
      id: 'ORD002',
      customerName: 'Trần Thị B',
      phone: '0909876543',
      status: 'delivered',
      progress: 100,
      route: [
        { latitude: 10.8231, longitude: 106.6297, label: 'Kho chính - Q.10' },
        { latitude: 10.8800, longitude: 106.6500, label: 'Khách hàng - Q.5' },
      ],
      currentLocation: { latitude: 10.8800, longitude: 106.6500 },
      estimatedArrival: 'Đã giao',
      items: [
        { name: 'Balo chống nước', quantity: 1 }
      ]
    },
    {
      id: 'ORD003',
      customerName: 'Lê Văn C',
      phone: '0912345678',
      status: 'pending',
      progress: 0,
      route: [
        { latitude: 10.8231, longitude: 106.6297, label: 'Kho chính - Q.10' },
        { latitude: 10.7700, longitude: 106.6500, label: 'Khách hàng - Q.4' },
      ],
      currentLocation: { latitude: 10.8231, longitude: 106.6297 },
      estimatedArrival: '15:00',
      items: [
        { name: 'Gương chiếu hậu SH', quantity: 2 }
      ]
    }
  ],

  warehouse: {
    name: 'Kho chính AnhEmMotor',
    location: { latitude: 10.8231, longitude: 106.6297 },
    address: '123 Nguyễn Văn Cừ, Q.10, TP.HCM'
  },

  stats: {
    total: 15,
    inTransit: 8,
    delivered: 5,
    pending: 2
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'in_transit':
      return '#F59E0B';
    case 'delivered':
      return '#22C55E';
    case 'pending':
      return '#6B7280';
    default:
      return '#6B7280';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'in_transit':
      return Truck;
    case 'delivered':
      return CheckCircle;
    case 'pending':
      return Clock;
    default:
      return Package;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'in_transit':
      return 'Đang giao';
    case 'delivered':
      return 'Đã giao';
    case 'pending':
      return 'Chờ giao';
    default:
      return 'Không xác định';
  }
};

const MapTrackingScreen = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeShipments, setActiveShipments] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [mapRoutes, setMapRoutes] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Default region (TP.HCM)
  const defaultRegion = {
    latitude: 10.8231,
    longitude: 106.6297,
    latitudeDelta: 0.092,
    longitudeDelta: 0.042,
  };

  // Fetch active shipments from backend
  const fetchActiveShipments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveShipments();

      // Transform to map format (basic info)
      const transformed = data.map(item => transformActiveShipmentToMapFormat(item));
      setActiveShipments(transformed);

      // Prepare initial markers and routes (basic from active shipments only)
      // Note: Full route requires individual tracking API calls
      const markers = transformed.map((order, idx) => ({
        id: order.id,
        latitude: defaultRegion.latitude + (Math.random() - 0.5) * 0.1,
        longitude: defaultRegion.longitude + (Math.random() - 0.5) * 0.1,
        title: order.id,
        description: `${order.customerName} - ${getStatusLabel(order.status)}`,
        icon: order.status === 'delivered' ? 'delivered' : order.status === 'in_transit' ? 'in_transit' : 'pending',
        orderData: order,
      }));

      setMapMarkers(markers);
      setMapRoutes([]);
    } catch (err) {
      console.error('Failed to fetch active shipments:', err);
      setError('Không thể tải danh sách đơn vận chuyển. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch detailed tracking for a specific order
  const fetchTrackingDetails = useCallback(async (trackingNumber) => {
    try {
      setLoadingDetails(true);
      const data = await getShipmentTracking(trackingNumber);

      if (!data) {
        Alert.alert('Thông báo', 'Không tìm thấy thông tin vận chuyển');
        return null;
      }

      // Transform to full map format with routes
      const transformedOrder = transformTrackingResponseToMapFormat(data);

      // Update the order in activeShipments list
      setActiveShipments(prev => prev.map(order =>
        order.id === trackingNumber ? transformedOrder : order
      ));

      return transformedOrder;
    } catch (err) {
      console.error('Failed to fetch tracking details:', err);
      Alert.alert('Lỗi', 'Không thể tải chi tiết hành trình vận chuyển');
      return null;
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  // Handle marker press - fetch tracking details
  const handleMarkerPress = useCallback(async (marker) => {
    if (!marker.orderData) return;

    // If order already has route data, just select it
    if (marker.orderData.route && marker.orderData.route.length > 0) {
      setSelectedOrder(marker.orderData);
      return;
    }

    // Fetch full tracking details
    const fullData = await fetchTrackingDetails(marker.orderData.id);
    if (fullData) {
      setSelectedOrder(fullData);

      // Update map with routes
      const route = fullData.route.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
      setMapRoutes([route]);

      // Update marker with better position based on current location
      if (fullData.currentLocation) {
        setMapMarkers(prev => prev.map(m =>
          m.id === marker.id
            ? {
                ...m,
                latitude: fullData.currentLocation.latitude,
                longitude: fullData.currentLocation.longitude,
                orderData: fullData,
              }
            : m
        ));
      }
    }
  }, [fetchTrackingDetails]);

  // Refresh on pull down
  const onRefresh = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    await fetchActiveShipments();
  }, [fetchActiveShipments]);

  useEffect(() => {
    fetchActiveShipments();
  }, [fetchActiveShipments, retryCount]);

  // Prepare region based on selected order or default
  const mapRegion = selectedOrder?.currentLocation
    ? {
        latitude: selectedOrder.currentLocation.latitude,
        longitude: selectedOrder.currentLocation.longitude,
        latitudeDelta: 0.092,
        longitudeDelta: 0.042,
      }
    : defaultRegion;

  // Stats calculation
  const stats = {
    total: activeShipments.length,
    inTransit: activeShipments.filter(o => o.status === 'in_transit').length,
    delivered: activeShipments.filter(o => o.status === 'delivered').length,
    pending: activeShipments.filter(o => o.status === 'pending').length,
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.subtext }]}>
          Đang tải dữ liệu vận chuyển...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <WifiOff size={64} color={colors.subtext} />
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRefresh}
        >
          <RefreshCw size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backBtnText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Theo Dõi Vận Chuyển
        </Text>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={onRefresh}
        >
          <RefreshCw size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Tổng đơn</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.inTransit}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Đang giao</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#22C55E' }]}>{stats.delivered}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Đã giao</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#6B7280' }]}>{stats.pending}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Chờ giao</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        {loading || loadingDetails ? (
          <View style={[styles.mapPlaceholder, { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.subtext, marginTop: 8 }]}>
              {loadingDetails ? 'Đang tải hành trình...' : 'Đang tải bản đồ...'}
            </Text>
          </View>
        ) : (
          <MapView
            region={mapRegion}
            markers={mapMarkers}
            routes={mapRoutes}
            onMarkerPress={handleMarkerPress}
            style={{ width: '100%', height: '100%' }}
            mapType="roadmap"
            showRouteLines={true}
          />
        )}
      </View>

      {/* Selected Order Detail - Bottom Sheet */}
      {selectedOrder && (
        <View style={[styles.bottomSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

          {/* Order Header */}
          <View style={styles.orderHeader}>
            <View style={styles.orderHeaderLeft}>
              <Package color={colors.primary} size={24} />
              <View style={styles.orderInfo}>
                <Text style={[styles.orderId, { color: colors.text }]}>
                  {selectedOrder.id}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) + '20', borderColor: getStatusColor(selectedOrder.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(selectedOrder.status) }]}>
                    {getStatusLabel(selectedOrder.status)}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedOrder(null)}>
              <Text style={[styles.closeBtn, { color: colors.subtext }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Customer Info */}
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <User size={16} color={colors.subtext} />
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Khách hàng:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{selectedOrder.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>SĐT:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{selectedOrder.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={16} color={colors.subtext} />
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Dự kiến:</Text>
              <Text style={[styles.infoValue, { color: selectedOrder.status === 'delivered' ? colors.success : colors.warning }]}>
                {selectedOrder.estimatedArrival}
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tiến độ giao hàng</Text>
            <View style={[styles.progressContainer, { backgroundColor: colors.border + '40' }]}>
              <View style={[styles.progressBar, { width: `${selectedOrder.progress}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.text }]}>
              {selectedOrder.progress}% hoàn thành
            </Text>
          </View>

          {/* Route Timeline */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tuyến đường giao hàng</Text>
            {selectedOrder.route && selectedOrder.route.length > 0 ? (
              selectedOrder.route.map((point, idx) => (
                <View key={idx} style={styles.routeItem}>
                  <View style={styles.routeItemLeft}>
                    <View style={[styles.routeDot, {
                      backgroundColor: idx === 0 ? colors.primary :
                                     idx === selectedOrder.route.length - 1 ? colors.success : colors.accent,
                      borderWidth: idx === (selectedOrder.status === 'delivered' ? selectedOrder.route.length - 1 : 0) ? 3 : 0,
                      borderColor: '#fff'
                    }]} />
                    {idx < selectedOrder.route.length - 1 && (
                      <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                  <View style={styles.routeItemRight}>
                    <Text style={[styles.routeLabel, { color: colors.text }]}>{point.label}</Text>
                    <Text style={[styles.routeCoords, { color: colors.subtext }]}>
                      {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                    </Text>
                    {idx < selectedOrder.route.length - 1 && (
                      <Text style={[styles.routeArrow, { color: colors.subtext }]}>↓</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.noRouteText, { color: colors.subtext }]}>
                Chưa có thông tin tuyến đường
              </Text>
            )}
          </View>

          {/* Order Items */}
          {selectedOrder.items && selectedOrder.items.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Sản phẩm trong đơn</Text>
              {selectedOrder.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.itemQty, { color: colors.subtext }]}>SL: {item.quantity}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              console.log('Navigate to order detail:', selectedOrder.id);
              // TODO: Navigate to order detail screen
            }}
          >
            <Text style={styles.actionButtonText}>Xem Toàn Bộ Chi Tiết Đơn Hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  backBtnText: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    marginHorizontal: theme.spacing.sm,
  },
  mapWrapper: {
    flex: 1,
    margin: theme.spacing.xs,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    fontSize: 13,
    marginTop: 8,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderInfo: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 24,
    fontWeight: '300',
    padding: 4,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  infoLabel: {
    fontSize: 13,
    marginLeft: theme.spacing.xs,
    minWidth: 70,
  },
  infoValue: {
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },
  progressContainer: {
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  routeItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  routeItemLeft: {
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    width: 20,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLine: {
    width: 2,
    flex: 1,
    marginTop: 2,
    marginBottom: 10,
  },
  routeItemRight: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  routeCoords: {
    fontSize: 11,
    opacity: 0.7,
  },
  routeArrow: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  itemName: {
    fontSize: 13,
    flex: 1,
  },
  itemQty: {
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: theme.colors.border + '30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noRouteText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
});

export default MapTrackingScreen;
