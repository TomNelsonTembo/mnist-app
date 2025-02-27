import axios from 'axios';

export const predict = async (inputData, modelVersion) => {
  const API_URL = ``;

  try {
    const response = await axios.post(API_URL, {
      instances: [inputData],
    });

    return response.data;
  } catch (error) {
    console.error("Prediction error:", error);
    return null;
  }
};
