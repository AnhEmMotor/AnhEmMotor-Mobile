import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';

const CustomMarker = ({ color, size = 32, children }) => {
  return (
    <View style={[styles.markerContainer, { width: size, height: size }]}>
      <View style={[styles.markerPin, { backgroundColor: color, borderColor: '#fff' }]}>
        {children}
      </View>
    </View>
  );
};

const MapViewNative = ({
  region,
  markers = [],
  onRegionChange,
  onMarkerPress,
  style,
  mapType = 'standard',
  showsUserLocation = false,
  children
}) => {
  const mapRef = useRef(null);

  const renderMarkers = () => {
    return markers.map((marker, index) => {
      const markerColor = () => {
        if (marker.icon === 'warehouse') return '#10B981'; // green
        if (marker.icon === 'delivered') return '#22C55E'; // green-light
        if (marker.icon === 'in_transit') return '#F59E0B'; // amber
        return '#64748B'; // slate
      };

      return (
        <Marker
          key={marker.id || index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          onPress={() => onMarkerPress && onMarkerPress(marker)}
        >
          <CustomMarker color={markerColor()} size={36}>
            <View style={styles.markerIcon}>
              {marker.icon === 'warehouse' ? '🏭' :
               marker.icon === 'delivered' ? '✅' :
               marker.icon === 'in_transit' ? '🚚' : '📍'}
            </View>
          </CustomMarker>

          <Callout
            tooltip={false}
            onPress={() => onMarkerPress && onMarkerPress(marker)}
          >
            <View style={[styles.callout, { backgroundColor: '#fff' }]}>
              <Text style={styles.calloutTitle} numberOfLines={1}>
                {marker.title}
              </Text>
              {marker.description && (
                <Text style={styles.calloutDescription} numberOfLines={2}>
                  {marker.description}
                </Text>
              )}
              {marker.orderData && (
                <>
                  <View style={[styles.calloutDivider, { backgroundColor: '#E5E7EB' }]} />
                  <View style={styles.calloutRow}>
                    <Text style={styles.calloutLabel}>Đơn hàng:</Text>
                    <Text style={styles.calloutValue}>{marker.orderData.id}</Text>
                  </View>
                  <View style={styles.calloutRow}>
                    <Text style={styles.calloutLabel}>Khách:</Text>
                    <Text style={styles.calloutValue}>{marker.orderData.customerName}</Text>
                  </View>
                  <View style={styles.calloutRow}>
                    <Text style={styles.calloutLabel}>Tiến độ:</Text>
                    <Text style={[
                      styles.calloutValue,
                      { color: marker.orderData.status === 'delivered' ? '#16a34a' : marker.orderData.status === 'in_transit' ? '#d97706' : '#6b7280' }
                    ]}>
                      {marker.orderData.progress}% - {getStatusLabel(marker.orderData.status)}
                    </Text>
                  </View>
                </>
              )}
              <TouchableOpacity
                style={[styles.calloutButton, { backgroundColor: '#3B82F6' }]}
                onPress={() => {
                  console.log('View order:', marker.orderData?.id);
                }}
              >
                <Text style={styles.calloutButtonText}>Xem Chi Tiết</Text>
              </TouchableOpacity>
            </View>
          </Callout>
        </Marker>
      );
    });
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
        mapType={mapType}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {renderMarkers()}
        {children}
      </MapView>
    </View>
  );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 16,
  },
  callout: {
    width: 220,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  calloutDivider: {
    height: 1,
    marginVertical: 8,
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  calloutValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    textAlign: 'right',
  },
  calloutButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default MapViewNative;
