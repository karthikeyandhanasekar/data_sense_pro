// cmd API Controller

import { apiUrl } from "../paths/api_url";
import { get, post } from "../services/apiService";

const { getUrl, postUrl, removeUrl, putUrl, getbyIDurl } = apiUrl["cmd"];

export const postCMDController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data

    const body = {
      target: formData.target.trim(),
      subTarget: formData.subTarget.trim(),
      sectorClassification: formData.sectorClassification.trim(),
      incorporationCity: formData.incorporationCity.trim(),
    };
    // Send the POST request to the cmd API API endpoint
    const response = await post(postUrl, body);
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCMDController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      target: formData.target.trim(),
      subTarget: formData.subTarget.trim(),
      sectorClassification: formData.sectorClassification.trim(),
      incorporationCity: formData.incorporationCity.trim(),
    };
    // Send the PUT request to the cmd API API endpoint
    const response = await post(putUrl(formData.id), body);

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCMDController = async () => {
  try {
    // Data Validation and Sanitization

    // Send the GET request to the cmd API API endpoint
    const response = await post(getUrl);
    // Handle the response (e.g., check for errors, parse response data)

    // Return the response data
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getByIDCMDController = async (id) => {
  try {
    // Data Validation and Sanitization

    // Send the GET request to the cmd API API endpoint
    const response = await get(getbyIDurl(id));
    // Handle the response (e.g., check for errors, parse response data)
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeCMDController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData) {
      throw new Error("Invalid form data");
    }
    // Send the DELETE request to the cmd API API endpoint
    const response = await post(removeUrl(formData));
    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
