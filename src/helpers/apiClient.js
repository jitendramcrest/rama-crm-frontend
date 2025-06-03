import axios from "axios";
import { config } from "../config/config";
import { store } from "../redux/store";

// let reduxDispatch = null;
 
// export const setAxiosDispatch = (dispatch) => {
//   reduxDispatch = dispatch;
// };
 
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${config.baseUrl}/`,
  timeout: 30000,
});
 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState()?.authData?.authToken;
    if (token && config?.headers) config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.log(error.response.status);
    return Promise.reject(error);
  }
);
 
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // const status = error?.response?.status;
    
    // if (status === 404) {
    //   window.location.reload();
    // }

    if (error.response && error.response.status === 401) {
      //window.location.href = "/login";
    } else {
      // toast.error(error.message || "Something went wrong");
      // reduxDispatch(setError(error.message || "Something went wrong"));
     
    }
    return Promise.reject(error);
  }
);
 
export default axiosInstance;
 