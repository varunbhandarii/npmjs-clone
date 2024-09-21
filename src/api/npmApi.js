import axios from "axios";

const BASE_URL = "https://registry.npmjs.org";

export const searchPackages = async (
  query,
  page = 1,
  size = 20,
  sortBy = "optimal"
) => {
  let sortParam = "";

  if (sortBy === "popularity") {
    sortParam = "&popularity=1";
  } else if (sortBy === "quality") {
    sortParam = "&quality=1";
  } else if (sortBy === "maintenance") {
    sortParam = "&maintenance=1";
  }

  try {
    const response = await axios.get(
      `https://registry.npmjs.org/-/v1/search?text=${query}&size=${size}&from=${
        (page - 1) * size
      }${sortParam}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching packages:", error);
    throw error;
  }
};

// Get package details by package name
export const getPackageDetails = async (packageName) => {
  try {
    const response = await axios.get(`${BASE_URL}/${packageName}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to handle API errors and network errors
const handleApiError = (error) => {
  if (!error.response) {
    // Network error
    throw new Error("Network Error: Please check your internet connection.");
  } else {
    throw new Error(
      error.response.data.error || "An error occurred while fetching data."
    );
  }
};
