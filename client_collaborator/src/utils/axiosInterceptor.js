import axios from "axios";
export var axiosInstance = axios.create({
//   baseURL: "https://platform.elecbits.in/api/",

baseURL: "https://collaborator1.herokuapp.com/",
  // baseURL: "http://localhost:3000",
  // baseURL:"http://ec2-13-235-231-27.ap-south-1.compute.amazonaws.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});