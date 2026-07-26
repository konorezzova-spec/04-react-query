import css from "../MovieGrid/MovieGrid.module.css";
import type { Movie } from "../../types/movie.ts";

interface MovieGridProps {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}

export default function MovieGrid({ onSelect, movies }: MovieGridProps) {
  return (
    <>
      <ul className={css.grid}>
        {/* Набір елементів списку з фільмами */}

        {movies.map((movie: Movie) => {
          const { id, poster_path, title } = movie;

          return (
            <li key={id}>
              <div className={css.card} onClick={() => onSelect(movie)}>
                <img
                  className={css.image}
                  src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
                  alt={title}
                  loading="lazy"
                />
                <h2 className={css.title}>{title}</h2>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
