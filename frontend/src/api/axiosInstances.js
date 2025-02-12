import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7235/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default API;
