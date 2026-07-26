import "./App.module.css";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar.tsx";
import { fetchMovies } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import ReactPaginate from "./ReactPaginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

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

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  // for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Movie | null>(null);
  const openModal = (movie: Movie) => {
    setSelectedItem(movie);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
        />
      )}

      {isLoading && <p>Loading data, please wait...</p>}
      {isError && <p>Whoops, something went wrong! Please try again!</p>}
      {data && data.total_pages > 0 && (
        <MovieGrid onSelect={openModal} movies={data.results} />
      )}

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <MovieModal onClose={closeModal} movie={selectedItem} />
      )}
    </>
  );
}
