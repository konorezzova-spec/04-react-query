import axios from "axios";
import { type Movie } from "../types/movie";

// Типізували відповідь від бекенду
interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}
const myKey = import.meta.env.VITE_TMDB_TOKEN;

// HTTP-функція запиту статей
export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieHttpResponse> => {
  const url = "https://api.themoviedb.org/3/search/movie";

  const params = {
    query: query,
    include_adult: false,
    language: "en-US",
    page,
  };
  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${myKey}`,
  };

  const response = await axios.get<MovieHttpResponse>(url, { params, headers });

  return response.data;
};
