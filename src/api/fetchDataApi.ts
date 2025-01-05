import axios from 'axios';

const weatherBaseUrl = process.env.REACT_APP_WEATHER_API_BASE_URL;

export const fetchWeatherDataForCity = async (cityName: string): Promise<string> => {
    const response = await axios.get(`${weatherBaseUrl}/find/${encodeURIComponent(cityName)}`);
    return response.data;
};
