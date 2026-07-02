import { API_BASE_URL } from '../config';

/**
 * Fetch active shipments that are currently in transit
 * @returns {Promise<Array>} List of active shipments
 */
export async function getActiveShipments() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/logistics/active-shipments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Failed to fetch active shipments:', error);
    throw error;
  }
}

/**
 * Fetch detailed tracking information for a shipment
 * @param {string} searchQuery - Tracking number, order code, or customer phone
 * @returns {Promise<Object>} Tracking details
 */
export async function getShipmentTracking(searchQuery) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/logistics/tracking/${encodeURIComponent(searchQuery)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Failed to fetch shipment tracking:', error);
    throw error;
  }
}

/**
 * Transform backend ActiveShipmentItem to MapTrackingScreen format
 * Backend: { id, trackingNumber, customerName, customerPhone, customerAddress, carrier, status, codAmount, shippingCost, createdAt, expectedAt, daysInTransit, isStuck }
 * Mobile Map: { id, customerName, phone, status, progress, route, currentLocation, estimatedArrival, items }
 */
export function transformActiveShipmentToMapFormat(activeShipment) {
  // For active shipments, we don't have full route data - need to fetch tracking details separately
  // Return minimal data for list view
  return {
    id: activeShipment.trackingNumber,
    customerName: activeShipment.customerName,
    phone: activeShipment.customerPhone,
    status: mapBackendStatusToMobile(activeShipment.status),
    progress: 0, // Will be updated when tracking details fetched
    route: [], // Will be populated from tracking API
    currentLocation: null,
    estimatedArrival: activeShipment.expectedAt ? formatDate(activeShipment.expectedAt) : 'Đang cập nhật',
    items: [], // Will be populated from tracking API
  };
}

/**
 * Transform backend TrackingResponse to MapTrackingScreen format with full route
 * Mobile Map format expects:
 * - route: array of { latitude, longitude }
 * - currentLocation: { latitude, longitude }
 */
export function transformTrackingResponseToMapFormat(trackingData) {
  const route = [];

  // Add origin if available
  if (trackingData.originLat && trackingData.originLng) {
    route.push({
      latitude: trackingData.originLat,
      longitude: trackingData.originLng,
      label: 'Kho xuất phát',
    });
  }

  // Add milestones as route points
  if (trackingData.milestones && Array.isArray(trackingData.milestones)) {
    trackingData.milestones.forEach((milestone, index) => {
      if (milestone.latitude && milestone.longitude) {
        route.push({
          latitude: milestone.latitude,
          longitude: milestone.longitude,
          label: milestone.locationName || `Điểm ${index + 1}`,
        });
      }
    });
  }

  // Add destination if available
  if (trackingData.destLat && trackingData.destLng) {
    route.push({
      latitude: trackingData.destLat,
      longitude: trackingData.destLng,
      label: 'Địa chỉ giao hàng',
    });
  }

  // Determine current location (last milestone marked as current, or last point in route)
  let currentLocation = null;
  const currentMilestone = trackingData.milestones?.find(m => m.isCurrentLocation);
  if (currentMilestone && currentMilestone.latitude && currentMilestone.longitude) {
    currentLocation = {
      latitude: currentMilestone.latitude,
      longitude: currentMilestone.longitude,
    };
  } else if (route.length > 0) {
    currentLocation = {
      latitude: route[route.length - 1].latitude,
      longitude: route[route.length - 1].longitude,
    };
  }

  // Calculate progress based on milestones
  const totalMilestones = trackingData.milestones?.length || 0;
  const completedMilestones = trackingData.milestones?.filter(m => !m.isCurrentLocation && !m.isStuck).length || 0;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return {
    id: trackingData.trackingNumber,
    customerName: trackingData.customerName,
    phone: trackingData.customerPhone,
    status: mapBackendStatusToMobile(trackingData.status),
    progress: progress,
    route: route,
    currentLocation: currentLocation,
    estimatedArrival: trackingData.expectedDelivery ? formatDate(trackingData.expectedDelivery) : 'Đang cập nhật',
    items: trackingData.products?.map(p => ({
      name: p.productName,
      quantity: p.quantity,
    })) || [],
  };
}

/**
 * Map backend status number to mobile status string
 * Backend status: number (need to check actual values from backend)
 * Assuming: 0=Pending, 1=In Transit, 2=Delivered, etc.
 */
function mapBackendStatusToMobile(status) {
  // TODO: Confirm exact status values from backend
  const statusMap = {
    0: 'pending',
    1: 'in_transit',
    2: 'delivered',
    // Add more mappings as needed
  };
  return statusMap[status] || 'pending';
}

/**
 * Format date string to Vietnamese format
 */
function formatDate(dateString) {
  if (!dateString) return 'Đang cập nhật';
  const date = new Date(dateString);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} - ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}
