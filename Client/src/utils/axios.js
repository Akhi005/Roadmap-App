import axios from 'axios'

const API = 'https://roadmap-backend-akhis-projects.vercel.app'

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api