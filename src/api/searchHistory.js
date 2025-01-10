import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL

export const getSearchHistoryForUser = async (user) => {
    const response = await axios.get(`${baseUrl}/search-history/user/${user}`);
    return response.data;
};

export const addWeatherToSearchHistory = async (email, data ) => {
    const response = await axios.post(`${baseUrl}/search-history/${email}`,  data);
    return response.data;
};