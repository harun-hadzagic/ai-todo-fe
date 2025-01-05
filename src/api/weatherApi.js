import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL


export const getAllSavedWeathers = async () => {
    const response = await axios.get(`${baseUrl}`);
    return response.data;
};

export const createWeather = async (weather, email, customLocationName) => {
    const response = await axios.post(`${baseUrl}/${email}`, { weather, customLocationName });
    return response.data;
};

export const updateWeather = async (id, weather) => {
    const response = await axios.put(`${baseUrl}/${id}`, {
        "id": id,
        "title": "",
        "description": weather.description,
        "dueDate": null,
        "priority": weather.priority,
        "status": weather.status,
        "user": null,
        "category": null
      });
    return response.data;
};

export const deleteWeather = async (id) => {
    await axios.delete(`${baseUrl}/${id}`);
};
