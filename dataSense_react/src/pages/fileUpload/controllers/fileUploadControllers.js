import { get, post } from "../../../services/apiService";

const renameFile = (file, newFileName) =>
  new File([file], newFileName, {
    type: file.type,
    lastModified: file.lastModified,
  });

export const uploadFilesController = async (formData) => {
  try {
    formData.file.forEach((file) => {
      file.file = renameFile(file.file, `${formData.domain}_${file.file.name}`);
    });

    const fileData = new FormData();
    for (let i = 0; i < formData.file.length; i++) {
      fileData.append("files", formData.file[i].file);
    }

    // Send the POST request to the user API endpoint
    const response = await post("/uploads", fileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFileDetails = async () => {
  try {
    // Send the POST request to the user API endpoint
    const response = await get("/getFiles");

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFileDetailsInformation = async (domain, fileName) => {
  try {
    // Send the POST request to the user API endpoint
    const response = await get(`/getFiles/${domain}/${fileName}`);

    // Return the response data
    return response;
  } catch (error) {
    throw error;
  }
};
