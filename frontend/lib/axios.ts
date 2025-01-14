import Axios from "axios";

// Create an Axios instance
export const axios = Axios.create({
  baseURL: "http://localhost:4000", // Replace with your API URL
  withCredentials: true, // Include cookies in requests
});
