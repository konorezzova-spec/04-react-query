import axios from "axios";
import { type Movie } from "../types/movie";

// Типізували відповідь від бекенду
interface MovieHttpResponse {
  results: Movie[];
}
const myKey = import.meta.env.VITE_TMDB_TOKEN;

// HTTP-функція запиту статей
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const url = "https://api.themoviedb.org/3/search/movie";

  const params = {
    query: query,
    include_adult: false,
    language: "en-US",
    page: 1,
  };
  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${myKey}`,
  };

  const response = await axios.get<MovieHttpResponse>(url, { params, headers });

  // console.log("search log", response.data.results);
  return response.data.results;
};
