import { AppViewMore } from "@cs/components/app-view/AppViewMore";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { ImagePath } from "@cs/constants/ImageConstants";
import { MovieService } from "@cs/services/MovieService";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function AppUpcomingMovies()
{


  const [isLoadMore, setIsLoadMore] = useState(false);
  const [upcomingMoviesList, setUpcomingMoviesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  function prepareMediaList()
  {
    return upcomingMoviesList.map((movie) => (
      {
        id: movie.id,
        title: movie.title,
        posterImageUrl: ImagePath.POSTER_PATH + movie.poster_path,
      }));
  }

  useEffect(() =>
  {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await MovieService.getUpcomingMovies(currentPage);
        const isLoadMore = currentPage === response.total_pages - 1;
        setIsLoadMore(!isLoadMore);
        setUpcomingMoviesList((prevValue) => prevValue.concat(response.data.results));
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, handleError]);



  return (
    <>
      {loading && upcomingMoviesList.length === 0 ? (
        <AppLoading fullscreen message="Loading upcoming movies..." />
      ) : (
        <>
          {upcomingMoviesList.length > 0 &&
            <AppViewMore
              title="Upcoming Movies"
              items={prepareMediaList()}
              isLoadMore={isLoadMore}
              handleLoadMore={() => setCurrentPage((prevValue) => prevValue + 1)}
              handlePosterClick={(id) => navigate(`/movies/${ id }`)
              }
            />
          }
          {loading && upcomingMoviesList.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-color-3)' }}>
              <AppLoading size="large" message="Loading more..." />
            </div>
          )}
        </>
      )}
    </>
  );
}
