import axios from "axios";

const UNSPLASH_URL = "https://api.unsplash.com/search/photos";

export const fetchImage = async (query) => {
  try {
    const res = await axios.get(UNSPLASH_URL, {
      params: {
        query: query,
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    return res.data.results[0]?.urls?.regular || null;
  } catch (err) {
    console.error("Image fetch error:", err.message);
    return null;
  }
};
