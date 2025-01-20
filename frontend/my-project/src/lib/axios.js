import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? 'http://localhost:3000/api':"http://3.109.2.124/api",
    withCredentials: true,
});
