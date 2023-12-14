// Author: Joshua Barbee

import axios from "axios"

const backendUrl = "http://localhost:3001";

// Prepend the backend URL to the endpoint, allow cookie authentication, and
// pass the arguments to axios.
export const get = (endpoint, ...args) =>
    axios.get(backendUrl + endpoint, allowCredentials(args[0]));

export const post = (endpoint, data, ...args) =>
    axios.post(backendUrl + endpoint, data, allowCredentials(args[0]));

export const put = (endpoint, data, ...args) =>
    axios.put(backendUrl + endpoint, data, allowCredentials(args[0]));

export const deleteData = (endpoint, ...args) =>
    axios.delete(backendUrl + endpoint, allowCredentials(args[0]));

const allowCredentials = config => ({ ...config, withCredentials: true });
