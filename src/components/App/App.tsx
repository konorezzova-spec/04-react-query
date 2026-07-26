import "./App.module.css";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar.tsx";
import toast, { Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import Loader from "../Loader/Loader.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
// import css from "../MovieModal/MovieModal.module.css";

export default function App() {
  // Оголошуємо і типізуємо стан завантаження фільмів
  const [movies, setMovies] = useState<Movie[]>([]);
  // Додаємо стан індикатора завантаження
  const [isLoading, setIsLoading] = useState(false);
  // Оголошуємо стан помилки
  const [isError, setIsError] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(query);
      setMovies(data);
      if (data.length == 0) {
        toast("No movies found for your request.");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
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
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />}
      <Toaster />

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <MovieModal onClose={closeModal} movie={selectedItem} />
      )}
    </>
  );
}
