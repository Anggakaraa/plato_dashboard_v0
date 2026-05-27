import axios from "axios";
import { getToken } from "../storage/token";

const getRequest = (auth = true) => {
  const url = import.meta.env.VITE_APP_API_URL;
  const request = axios.create({
    baseURL: url,
    timeout: 60000,
  });
  
  if (auth) request.defaults.headers.common["Authorization"] = `${getToken()}`;

  if (import.meta.env.VITE_ENV === 'local') {
    request.interceptors.request.use(request => {
      //console.log("axios", JSON.stringify(request, null, 2));
      return request;
    });
  }
  
  request.interceptors.response.use((response) => response, (error) => Promise.reject(error));
  return request;
}

export const get = async (url, auth = true, config = {}) => {
  return await getRequest(auth)
    .get(url, { ...config })
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) return response.data;
        else throw response.error;
      });
}

export const post = async (url, data, auth = true, config = {}) => {
  return await getRequest(auth)
    .post(url, { ...data }, { ...config })
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) return response.data;
        else throw response.error;
      });
}

export const put = async (url, data, auth = true, config = {}) => {
  return await getRequest(auth)
    .put(url, { ...data }, { ...config })
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) return response.data;
        else throw response.error;
      });
}

export const del = async (url, auth = true, config = {}) => {
  return await getRequest(auth)
    .delete(url, { ...config })
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) return response.data;
        else throw response.error;
      });
}
