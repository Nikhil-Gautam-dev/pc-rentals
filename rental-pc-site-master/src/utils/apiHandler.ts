import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your API base URL

// Generic GET request handler
export const getRequest = async <T>(endpoint: string): Promise<T> => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data.data;
    } catch (error) {
        return null;
    }
};

// Generic POST request handler
export const postRequest = async <T, U>(endpoint: string, data: U): Promise<T> => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
        return response.data;
    } catch (error) {
        return null;
    }
};
