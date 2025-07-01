import axios from 'axios'

const API = 'https://roadmap-backend-xi.vercel.app' 
// || 'http://localhost:4000';

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
