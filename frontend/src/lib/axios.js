import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5010/api/",
  //쿠키보내주는것 허용해주기
  withCredentials: true,
});
