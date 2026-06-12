import axios from "axios";

const API = axios.create({
  baseURL:
    "https://inventory-management-system-production-9e85.up.railway.app",
});

export default API;