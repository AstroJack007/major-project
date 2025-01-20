import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: "http://3.109.2.124/api",
    withCredentials: true,
});
