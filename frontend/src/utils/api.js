import axios from "axios"

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})

// attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers["auth_token"] = token
  }
  return config
})

export default api;