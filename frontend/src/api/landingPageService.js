import axios from 'axios';

/**
 * Service for Landing Page API calls
 * Uses relative paths so nginx can proxy requests to backend in Docker
 */
class LandingPageService {
    constructor() {
        this.api = axios.create({
            baseURL: '/api/landing-pages',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add auth token to requests
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    // Create a new landing page
    async createLandingPage(landingPageData) {
        const response = await this.api.post('', landingPageData);
        return response.data;
    }

    // Update an existing landing page
    async updateLandingPage(id, landingPageData) {
        const response = await this.api.put(`/${id}`, landingPageData);
        return response.data;
    }

    // Get landing page by ID (admin)
    async getLandingPageById(id) {
        const response = await this.api.get(`/${id}`);
        return response.data;
    }

    // Get published landing page by slug (public)
    async getPublishedLandingPage(slug) {
        const response = await axios.get(`/api/landing-pages/public/${slug}`);
        return response.data;
    }

    // Get all landing pages with pagination
    async getAllLandingPages(page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'DESC') {
        const response = await this.api.get('', {
            params: { page, size, sortBy, sortDirection },
        });
        return response.data;
    }

    // Get landing pages by status
    async getLandingPagesByStatus(status, page = 0, size = 10) {
        const response = await this.api.get(`/status/${status}`, {
            params: { page, size },
        });
        return response.data;
    }

    // Search landing pages
    async searchLandingPages(query, page = 0, size = 10) {
        const response = await this.api.get('/search', {
            params: { query, page, size },
        });
        return response.data;
    }

    // Publish a landing page
    async publishLandingPage(id) {
        const response = await this.api.patch(`/${id}/publish`);
        return response.data;
    }

    // Unpublish a landing page
    async unpublishLandingPage(id) {
        const response = await this.api.patch(`/${id}/unpublish`);
        return response.data;
    }

    // Archive a landing page
    async archiveLandingPage(id) {
        const response = await this.api.patch(`/${id}/archive`);
        return response.data;
    }

    // Delete a landing page
    async deleteLandingPage(id) {
        const response = await this.api.delete(`/${id}`);
        return response.data;
    }

    // Duplicate a landing page
    async duplicateLandingPage(id, newSlug) {
        const response = await this.api.post(`/${id}/duplicate`, null, {
            params: { newSlug },
        });
        return response.data;
    }

    // Get analytics for a landing page
    async getAnalytics(id, startDate, endDate) {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await this.api.get(`/${id}/analytics`, { params });
        return response.data;
    }

    // Get summary statistics
    async getSummaryStats() {
        const response = await this.api.get('/stats/summary');
        return response.data;
    }
}

export default new LandingPageService();

