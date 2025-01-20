import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: "http://3.109.2.124:3000/api",
    withCredentials: true,
});


axiosInstance.interceptors.request.use((request) => {
    console.log("Starting Request", request);
    return request;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("Response Error", error);
        return Promise.reject(error);
    }
);
