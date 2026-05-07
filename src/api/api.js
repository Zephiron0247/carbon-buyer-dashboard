import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const BUYER_WALLET = "0x9189C870dc3491210552e58496448faf1BDd89bC";

export const getAvailableCredits = () => API.get("/credits/available");

export const retireCredits = (payload) => API.post("/credits/retire", payload);

export default API;