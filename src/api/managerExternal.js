import axios from "axios";
import { getToken } from "../storage/token";

const getRequest = (auth = true) => {
  const url = import.meta.env.VITE_APP_GATEWAY_URL;
  const request = axios.create({
    baseURL: url,
    timeout: 60000,
  });
  
  //TODO change to the new auth token for App Service
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

export const getExternal = async (url, auth = true, config = {}) => {
  return await getRequest(auth)
    .get(url, { ...config })
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) return response.data;
        else throw response.error;
      });
}

export const getEventSource = async (url) => {
  const baseurl = import.meta.env.VITE_APP_GATEWAY_URL;
  const events = new EventSource(baseurl+url);
  events.onmessage = (event) => {
    const evt = JSON.parse(event.data)
    return evt;
  }
  return 2
}