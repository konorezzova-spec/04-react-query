import "./App.module.css";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar.tsx";
import { fetchMovies } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import Paginations from "./Paginations.tsx";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;
  if (data?.results.length == 0) {
    toast("No movies found for your request.");
  }

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  // for Modal

  const [selectedItem, setSelectedItem] = useState<Movie | null>(null);
  const openModal = (movie: Movie) => {
    setSelectedItem(movie);
  };
  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <Paginations
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.total_pages > 0 && (
        <MovieGrid onSelect={openModal} movies={data.results} />
      )}
      <Toaster />

      {/* Modal */}
      {selectedItem && <MovieModal onClose={closeModal} movie={selectedItem} />}
    </>
  );
}
