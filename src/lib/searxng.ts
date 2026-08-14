import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SEARXNG_URL =
  process.env.SEARXNG_URL || "http://localhost:8080";

type SearchOptions = {
  language?: string;
  engines?: string[];
  categories?: string[];
};

export const searchSearxng = async (
  query: string,
  options: SearchOptions = {}
) => {
  try {
    const params: any = {
      q: query,
      format: "json",
    };

    if (options.language) {
      params.language = options.language;
    }

    if (options.engines) {
      params.engines = options.engines.join(",");
    }

    if (options.categories) {
      params.categories = options.categories.join(",");
    }

    const response = await axios.get(
      `${SEARXNG_URL}/search`,
      {
        params,
      }
    );
    console.log("SearXNG response:");
console.log(JSON.stringify(response.data, null, 2));


    return response.data;
  } catch (error) {
    console.error("SearXNG Error:", error);
    throw error;
  }
};
