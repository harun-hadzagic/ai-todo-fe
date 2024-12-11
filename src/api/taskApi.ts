import axios from 'axios';
import { Task } from '../types/Task';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

export const getTasksByEmail = async (email: string): Promise<Task[]> => {
    const response = await axios.get(`${API_BASE_URL}/email/${email}`);
    return response.data;
};

export const createTask = async (task: Task, email: string): Promise<Task> => {
    const response = await axios.post(`${API_BASE_URL}/${email}`, task);
    return response.data;
};

export const updateTask = async (id: number, task: Task): Promise<Task> => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, task);
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};