import { apiPost, apiGet } from './httpClient';

export const contactApi = {
  submitSupportRequest: async (contactData) => {
    const payload = {
      request: {
        fullName: contactData.fullName || 'Khách hàng',
        phoneNumber: contactData.phoneNumber || '',
        email: contactData.email || 'guest@anhemmotor.vn',
        subject: contactData.subject,
        category: contactData.category || 'Service',
        content: contactData.content,
      },
    };
    const response = await apiPost('/api/v1/Contacts/support-request', payload);
    return response.json();
  },

  getSupportTracking: async (id, trackingToken) => {
    const response = await apiGet(
      `/api/v1/Contacts/support-request/${id}/tracking?token=${trackingToken}`
    );
    return response.json();
  },

  rateSupportEmployee: async (id, trackingToken, rating, comment) => {
    const response = await apiPost(`/api/v1/Contacts/support-request/${id}/customer-rating`, {
      trackingToken,
      rating,
      comment,
    });
    return response;
  },

  getMyFeedbacks: async () => {
    const response = await apiGet('/api/v1/client/support/my-feedbacks');
    return response.json();
  },
};
