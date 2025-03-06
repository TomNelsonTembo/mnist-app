import axios from 'axios';

export const predict = async (inputData, modelVersion) => {
  let API_URL;
  if (modelVersion == "1"){
    API_URL = ``;
  } else if (modelVersion == "2"){
    API_URL = ``;
  } else if (modelVersion == "3"){
    API_URL = ``;
  } else {
    console.log("Invalid model version");
  }
    


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
