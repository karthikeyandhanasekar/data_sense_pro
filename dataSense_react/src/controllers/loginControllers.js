// Login Controller

import { apiUrl } from "../paths/api_url";
import { post } from "../services/apiService";

export const loginController = async (formData) => {
  try {
    // Data Validation and Sanitization
    if (!formData || typeof formData !== "object") {
      throw new Error("Invalid form data");
    }

    // Prepare the body object with sanitized data
    const body = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    // Send the POST request to the login API endpoint
    const response = await post(apiUrl["login"], body);

    // Handle the response (e.g., check for errors, parse response data)
    if (!response || response.status !== 200) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    // Return the response data
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error("Error in loginController:", error);

    // Rethrow a sanitized error message
    throw new Error("Login request failed. Please try again.");
  }
};