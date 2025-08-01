import api from '../api';

// Campaigns
export const fetchAllCampaigns = () => api.get('/projects');
export const fetchMyCampaigns = () => api.get('/projects/my-projects');
export const createCampaign = (data) => api.post('/projects', data);
export const fetchCampaignDonors = (id) => api.get(`/projects/${id}/donors`);
export const fetchCampaignDonations = (id) => api.get(`/projects/${id}/donations`);
export const fetchCampaignById = (id) => api.get(`/projects/${id}`);

// Donations
export const donateToCampaign = (projectId, amount) =>
  api.post('/contributions', { projectId, amount });
export const fetchMyDonations = () => api.get('/contributions/me');
export const fetchDonationsByCampaign = (projectId) => api.get(`/contributions/by-campaign/${projectId}`);
