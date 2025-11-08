import { AppViewMore } from "@cs/components/app-view/AppViewMore";
import { ImagePath } from "@cs/constants/ImageConstants";
import { MovieService } from "@cs/services/MovieService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";

export function AppPopularMovies()
{


  const [isLoadMore, setIsLoadMore] = useState(false);
  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  function prepareMediaList()
  {
    return popularMoviesList.map((movie) => (
      {
        id: movie.id,
        title: movie.title,
        posterImageUrl: ImagePath.POSTER_PATH + movie.poster_path,
      }));
  }

  useEffect(() =>
  {
    setLoading(true);
    MovieService.getPopularMovies(currentPage)
      .then((response) =>
      {
        const isLoadMore = currentPage === response.total_pages - 1;
        setIsLoadMore(!isLoadMore);
        setPopularMoviesList((prevValue) => prevValue.concat(response.data.results));
      })
      .catch((error) => handleError(error))
      .finally(() => setLoading(false));
  }, [currentPage, handleError]);



  return (
    <>
      {loading && popularMoviesList.length === 0 ? (
        <AppLoading fullscreen message="Loading popular movies..." />
      ) : (
        <>
          {popularMoviesList.length > 0 &&
            <AppViewMore
              title="Popular Movies"
              items={prepareMediaList()}
              isLoadMore={isLoadMore}
              handleLoadMore={() => setCurrentPage((prevValue) => prevValue + 1)}
              handlePosterClick={(id) => navigate(`/movies/${ id }`)
              }
            />
          }
          {loading && popularMoviesList.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-color-3)' }}>
              <AppLoading size="large" message="Loading more..." />
            </div>
          )}
        </>
      )}
    </>
  );
}
