import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? 'http://localhost:3000/api':"http://52.66.244.205:4000/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
      }
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
