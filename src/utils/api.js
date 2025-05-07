import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // update if using full backend URL
});

export default api;
