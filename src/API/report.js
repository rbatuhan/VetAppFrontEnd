import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getReports = async (pageNumber = 0, pageSize = 10) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/reports`, {
            params: {
                pageNumber,
                pageSize,
            }
        });
        return data;
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error;
    }
};

export const deleteReport = async (id) => {
    try {
        const { data } = await axios.delete(`${BASE_URL}/api/v1/reports/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting report:", error);
        throw error;
    }
};

export const createReport = async (report) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/api/v1/reports`, report);
        return data;
    } catch (error) {
        console.error("Error creating report:", error);
        throw error;
    }
};

export const updateReportFunc = async (id, report) => {
    try {
        const { data } = await axios.put(`${BASE_URL}/api/v1/reports/${id}`, report);
        return data;
    } catch (error) {
        console.error("Error updating report:", error);
        throw error;
    }
};
