import axios from "axios";

export const $host = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL
});

export const $authHost = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL
})

$authHost.interceptors.request.use((config) => {
    config.headers = {
        ...config.headers,
        Authorization:`Bearer ${localStorage.getItem("Token")}`};
    return config;
})


