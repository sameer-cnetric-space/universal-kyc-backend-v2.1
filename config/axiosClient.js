const axios = require("axios");

const axiosInstance = axios.create({ timeout: 30000 });

async function requestREST({
  method = "GET",
  url,
  data,
  params,
  baseURL,
  headers,
}) {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
      baseURL,
      headers,
    });
    return response;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    throw new Error(
      `API Error: ${error.response?.status || "Unknown"} - ${errorMsg}`
    );
  }
}

module.exports = requestREST;
