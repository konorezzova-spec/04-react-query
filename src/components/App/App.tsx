import "./App.module.css";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar.tsx";
import { fetchMovies } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import Pagination from "./Pagination.tsx";
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
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const handleSearch = (newQuery: string) => {
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
        <Pagination
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
