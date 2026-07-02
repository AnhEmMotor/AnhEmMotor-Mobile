import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';

const MapViewWeb = ({
  region,
  markers = [],
  routes = [],
  onRegionChange,
  onMarkerPress,
  style,
  mapType = 'roadmap',
  showRouteLines = true,
  children
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  useEffect(() => {
    if (!apiKey) {
      setError('Google Maps API key chưa được cấu hình. Thêm EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY vào file .env');
      return;
    }

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapAnhEmMotor`;
      script.async = true;
      script.defer = true;
      script.onerror = () => setError('Không thể tải Google Maps script');
      document.head.appendChild(script);

      window.initMapAnhEmMotor = () => {
        console.log('Google Maps loaded');
        setIsLoaded(true);
      };
    } else {
      setIsLoaded(true);
    }

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      markersRef.current.forEach(m => m.setMap(null));
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const { latitude, longitude, latitudeDelta = 0.092, longitudeDelta = 0.042 } = region;

    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: Math.round(Math.log2(360 / latitudeDelta)),
      mapTypeId: google.maps.MapTypeId[mapType.toUpperCase()] || google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
    } else {
      mapInstanceRef.current.setOptions(mapOptions);
    }

    // Draw route lines
    if (showRouteLines && routes.length > 0) {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];

      routes.forEach((route, idx) => {
        if (route.length < 2) return;

        const path = route.map(point => ({ lat: point.latitude, lng: point.longitude }));

        const polyline = new google.maps.Polyline({
          path,
          strokeColor: idx === 0 ? '#3B82F6' : '#94A3B8',
          strokeOpacity: 0.8,
          strokeWeight: idx === 0 ? 4 : 2,
          geodesic: true,
          map: mapInstanceRef.current,
        });

        polylinesRef.current.push(polyline);
      });

      const bounds = new google.maps.LatLngBounds();
      routes.forEach(route => {
        route.forEach(point => {
          bounds.extend({ lat: point.latitude, lng: point.longitude });
        });
      });
      mapInstanceRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }

    const idleListener = mapInstanceRef.current.addListener('idle', () => {
      const center = mapInstanceRef.current.getCenter();
      const bounds = mapInstanceRef.current.getBounds();
      if (onRegionChange) {
        onRegionChange({
          latitude: center.lat(),
          longitude: center.lng(),
          latitudeDelta: bounds.getNorthEast().lat() - bounds.getSouthWest().lat(),
          longitudeDelta: bounds.getNorthEast().lng() - bounds.getSouthWest().lng(),
        });
      }
    });

    return () => {
      google.maps.event.removeListener(idleListener);
    };
  }, [isLoaded, region, routes, showRouteLines, onRegionChange]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // Set up global callback for info window buttons
    window.viewOrderDetail = (orderId) => {
      console.log('View order detail clicked:', orderId);
      if (onMarkerPress && selectedMarker) {
        onMarkerPress(selectedMarker);
      }
    };

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    markers.forEach((markerData, index) => {
      const { latitude, longitude, title, description, icon, orderData } = markerData;

      let markerIcon;
      if (icon === 'warehouse') {
        markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        };
      } else if (icon === 'delivered') {
        markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#22C55E',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        };
      } else if (icon === 'in_transit') {
        markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#F59E0B',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        };
      } else {
        markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#64748B',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        };
      }

      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        title,
        map: mapInstanceRef.current,
        animation: google.maps.Animation.DROP,
        icon: markerIcon,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="font-weight: 700; margin-bottom: 6px; color: #1e293b; font-size: 15px;">${title || ''}</div>
            ${description ? `<div style="font-size: 13px; color: #64748b; margin-bottom: 10px; line-height: 1.4;">${description}</div>` : ''}
            ${orderData ? `
              <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; align-items: center;">
                  <span style="font-size: 12px; color: #64748b;">Mã đơn:</span>
                  <span style="font-size: 12px; font-weight: 600; color: #1e293b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">${orderData.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 12px; color: #64748b;">Khách hàng:</span>
                  <span style="font-size: 12px; font-weight: 500; color: #1e293b;">${orderData.customerName || ''}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 12px; color: #64748b;">Điện thoại:</span>
                  <span style="font-size: 12px; color: #1e293b;">${orderData.phone || ''}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 12px; color: #64748b;">Tiến độ:</span>
                  <span style="font-size: 12px; font-weight: 600; color: ${orderData.status === 'delivered' ? '#16a34a' : orderData.status === 'in_transit' ? '#d97706' : '#6b7280'}">
                    ${orderData.progress || 0}% - ${getStatusLabel(orderData.status)}
                  </span>
                </div>
                ${orderData.estimatedArrival ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; background: #fef3c7; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #f59e0b;">
                    <span style="font-size: 12px; color: #92400e; font-weight: 600;">Dự kiến</span>
                    <span style="font-size: 12px; color: #92400e; font-weight: 600;">${orderData.estimatedArrival}</span>
                  </div>
                ` : ''}
                <div style="text-align: center;">
                  <button onclick="window.viewOrderDetail && window.viewOrderDetail('${orderData.id}')" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3); transition: transform 0.1s;">
                    Xem Chi Tiết Đơn Hàng
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        infoWindowRef.current = infoWindow;
        infoWindow.open(mapInstanceRef.current, marker);
        setSelectedMarker(orderData || markerData);
        if (onMarkerPress) {
          onMarkerPress(markerData);
        }
      });

      markersRef.current.push({ marker, infoWindow });
    });

    return () => {
      markersRef.current.forEach(({ marker, infoWindow }) => {
        marker.setMap(null);
        if (infoWindow) infoWindow.close();
      });
      markersRef.current = [];
    };
  }, [isLoaded, markers, onMarkerPress]);

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.helpText}>
          Thêm biến môi trường EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY vào file .env và restart Expo
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {children}
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
    position: 'relative',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  helpText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MapViewWeb;
