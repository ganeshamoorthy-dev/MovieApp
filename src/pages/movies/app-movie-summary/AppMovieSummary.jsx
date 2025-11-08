import { Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import { MovieService } from "@cs/services/MovieService";
import { AppMediaViewContent } from "@cs/components/app-media-view-content/app-media-view-content";
import { AppStarContent } from "@cs/components/app-star-content/AppStarContent";
import { ImagePath } from "@cs/constants/ImageConstants";
import { AppMediaCardList } from "@cs/components/app-media-card-list/AppMediaCardList";
import { AppCastCrew } from "@cs/components/app-cast-crew/AppCastCrew";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";

export function AppMovieSummary()
{

  const params = useParams();
  const [movieDetails, setMovieDetails] = useState();
  const [movieCredits, setMovieCredits] = useState();
  const [movieVideos, setMovieVideos] = useState();
  const [movieRecommendations, setMovieRecommendations] = useState();
  const [similarMovies, setSimilarMovies] = useState();
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();


  useEffect(() =>
  {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [detailsRes, creditsRes, videosRes, similarRes, recommendationsRes] = await Promise.all([
          MovieService.getMovieDetails(params.id),
          MovieService.getMovieCredits(params.id),
          MovieService.getMovieVideos(params.id),
          MovieService.getSimilarMovies(params.id),
          MovieService.getRecommendedMovies(params.id)
        ]);

        setMovieDetails(detailsRes.data);
        setMovieCredits(creditsRes.data);
        setMovieVideos(videosRes.data);
        setSimilarMovies(similarRes.data);
        setMovieRecommendations(recommendationsRes.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [params.id, handleError]);

  const getTimeString = (number) =>
  {
    const hours = Math.floor(number / 60);
    const minutes = number % 60;
    return `${ hours }h ${ minutes }m`;
  };

  const prepareMovieData = (movieList) =>
  {
    return movieList.filter((movie) => movie.poster_path && movie.backdrop_path)
      .map((movie) =>
      {
        return {
          id: movie.id,
          title: movie.title,
          posterImageUrl: ImagePath.BANNER_PATH + movie.poster_path,
          bannerImageUrl: ImagePath.BANNER_PATH + movie.backdrop_path,
        };
      });

  };


  return (
    <>
      {loading && <AppLoading fullscreen text="Loading movie details..." size="large" />}
      
      {!loading && (
        <div style={{ backgroundColor: "var(--bg-color-3)", paddingBottom: "2rem" }}>
          {movieDetails && movieCredits &&
            <AppStarContent
              bannerImageUrl={ImagePath.BANNER_PATH + movieDetails.backdrop_path}
              title={movieDetails.title}
              description={movieDetails.overview}
              id={movieDetails.id}>

              <AppMediaViewContent
                posterImageUrl={ImagePath.BANNER_PATH + movieDetails.poster_path}
                title={movieDetails.title}
                rating={movieDetails.vote_average}
                runtime={getTimeString(movieDetails.runtime)}
                description={movieDetails.overview}
                director={movieCredits.crew.filter(crew => crew.job === "Director").slice(0, 4).map(crew => crew.name).join(", ")}
                cast={movieCredits.cast.filter(crew => crew.known_for_department === "Acting").slice(0, 4).map(crew => crew.name).join(", ")}
                genres={movieDetails.genres}
                releaseDate={movieDetails.release_date}
              />
            </AppStarContent>
          }

          {movieVideos?.results?.length > 0 &&
            <AppMediaCardList
              items={movieVideos?.results}
              title="Videos"
              isVideo={true}
              isViewMore={false}
            />
          }

          {movieRecommendations &&
            <AppMediaCardList
              items={prepareMovieData(movieRecommendations.results)}
              title="Recommendations"
              isViewMore={false}
            />
          }

          {similarMovies?.results?.length > 0 &&
            <AppMediaCardList
              items={prepareMovieData(similarMovies.results)}
              title="Similar Movies"
              isViewMore={false} />
          }
          {movieCredits && <AppCastCrew credits={movieCredits} />}

          <Outlet />
        </div>
      )}
    </>
  );
}
