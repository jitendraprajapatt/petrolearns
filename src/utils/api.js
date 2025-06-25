import axios from 'axios';

const api = axios.create({
  baseURL:  process.env.LOCAL_ADDRESS,
  withCredentials: true,
});

export default api;