import axios from "axios";

const ipAddress = "192.168.0.106"; // your (dev) ip address. Change it also on package.json!

const api = axios.create({
  baseURL: `http://${ipAddress}:3333`,
});

export default api;
