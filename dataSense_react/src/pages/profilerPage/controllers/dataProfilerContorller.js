import { get, post, getFile } from "../../../services/apiService";

export const getProfileDetailsController = async (formData) => {
  try {
    const file_names = { file_names: formData };
    // Send the POST request to the user API endpoint
    const response = await post("/profiler/", file_names);

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTableQuery = async (domain, file_name, dbName) => {
  try {
    // Send the POST request to the user API endpoint
    const response = await get(`/query/${domain}/${file_name}/${dbName}`);

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getComparsionDetails = async (formData) => {
  try {
    // Send the POST request to the user API endpoint
    const response = await post(`/compare/`, formData);

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getComparsionFiles = async (fileName) => {
  try {
    // Send the POST request to the user API endpoint
    const response = await get(`/compare/${fileName}`,);

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};


export const getQueryFiles = async (fileName) => {
  try {
    // Send the POST request to the user API endpoint
    const response = await get(`/query/${fileName}`,);

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};


export const downloadFile = async (file_name, config = {}) => {
  try {
    // Send the POST request to the user API endpoint
    const response = await getFile(`/download/${file_name}`, config);
    // Return the response data
    return { headers: response.headers, data: response.data };
  } catch (error) {
    throw error;
  }
};
