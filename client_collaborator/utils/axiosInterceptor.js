import axios from "axios";
let token = localStorage.token;

var axiosInstance = axios.create({
  baseURL: "https://collaboratorbackend.azurewebsites.net/",
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  },
});


export default axiosInstance;