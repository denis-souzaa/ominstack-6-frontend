import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ominstack-backend.herokuapp.com',
});

export default api;
