const handleApiResponse = async (promise) => {
  try {
    const response = await promise;
    // Handle the successful response here
    return response.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: handleApiResponse.js:7 ~ handleApiResponse ~ error:",
      error
    );
    // Handle the error here
    console.error("API request error:", error?.message);

    return error;
    // throw error; // Re-throw the error to propagate it up the call stack
  }
};

export default handleApiResponse;
