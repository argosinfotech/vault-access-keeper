import axios from "axios";
import { CategoryType } from "@/types";

// API base URL
const API_BASE_URL = "https://localhost:44364/api";
const CATEGORY_TYPES_ENDPOINT = `${API_BASE_URL}/CategoryTypes`;

// API response type
interface CategoryTypeResponse {
  id: number;
  name: string;
  description?: string;
}

// Create a configured axios instance with auth headers
const getAxiosInstance = () => {
  const token = localStorage.getItem("token");
  
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
};

const axiosInstance = getAxiosInstance();

// Get all category types
export async function getCategoryTypes(): Promise<CategoryTypeResponse[]> {
  try {
    console.log("Fetching category types");
    const response = await axiosInstance.get(CATEGORY_TYPES_ENDPOINT);
    console.log("Received category types:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching category types:", error);
    throw error;
  }
}

// Convert category type to enum
export function mapCategoryNameToEnum(name: string): CategoryType {
  const normalizedName = name.toLowerCase().trim();
  
  switch (normalizedName) {
    case "staging hosting":
    case "development hosting":
      return CategoryType.STAGING_HOSTING;
    case "production hosting":
      return CategoryType.PRODUCTION_HOSTING;
    case "staging application":
      return CategoryType.STAGING_APPLICATION;
    case "live application":
      return CategoryType.LIVE_APPLICATION;
    case "qa application":
      return CategoryType.QA_APPLICATION;
    default:
      return CategoryType.OTHER;
  }
} 