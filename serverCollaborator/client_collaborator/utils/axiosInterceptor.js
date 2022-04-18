import axios from "axios";
let token = localStorage.token;

var axiosInstance = axios.create({
//   baseURL: "https://platform.elecbits.in/api/",
  baseURL: "http://localhost:3000",
  // baseURL:"http://ec2-13-235-231-27.ap-south-1.compute.amazonaws.com/api",
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  },
});


export default axiosInstance;