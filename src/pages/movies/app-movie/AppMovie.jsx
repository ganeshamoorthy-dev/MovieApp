import { AppMediaCardList } from "@cs/components/app-media-card-list/AppMediaCardList";
import { AppStarContent } from "@cs/components/app-star-content/AppStarContent";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { ImagePath } from "@cs/constants/ImageConstants";
import { MovieService } from "@cs/services/MovieService";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function AppMovies()
{
  const [trendingMovies, setTrendingMovies] = useState();
  const [nowPlayingMovies, setNowPlayingMovies] = useState();
  const [popularMovies, setPopularMovies] = useState();
  const [topRatedMovies, setTopRatedMovies] = useState();
  const [upcomingMovies, setUpcomingMovies] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  useEffect(() =>
  {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trending, nowPlaying, popular, topRated, upcoming] = await Promise.all([
          MovieService.getMovieTrends(),
          MovieService.getNowPlayingMovies(),
          MovieService.getPopularMovies(),
          MovieService.getTopRatedMovies(),
          MovieService.getUpcomingMovies()
        ]);
        
        setTrendingMovies(trending.data);
        setNowPlayingMovies(nowPlaying.data);
        setPopularMovies(popular.data);
        setTopRatedMovies(topRated.data);
        setUpcomingMovies(upcoming.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [handleError]);



  function prepareMediaList(data)
  {
    const items = data.map(media => ({
      id: media.id,
      title: media.title ?? media.name,
      description: media.overview,
      isAdult: media.adult,
      releaseDate: media.release_date,
      voting: media.vote_average,
      bannerImageUrl: ImagePath.BANNER_PATH + media.backdrop_path,
      posterImageUrl: ImagePath.POSTER_PATH + media.poster_path,
    }));
    return items;
  }

  return (
    <>
      {loading ? (
        <AppLoading fullscreen message="Loading movies..." />
      ) : (
        <div style={{ backgroundColor: "var(--bg-color-3)", paddingBottom: "2rem" }}>
          {
            trendingMovies &&
            <>
              <AppStarContent
                title={trendingMovies.results.at(0).title}
                bannerImageUrl={ImagePath.BANNER_PATH + trendingMovies.results.at(0).backdrop_path}
              >
                <div className="title">
                  {trendingMovies.results.at(0).title}
                </div>

                <div className="description">
                  {trendingMovies.results.at(0).overview}
                </div>
                <div className="btn">
                  <button
                    type="button"
                    onClick={() => navigate(`/movies/${ trendingMovies.results.at(0).id }`)}>
                    More Info
                  </button>
                </div>
              </AppStarContent>
              <AppMediaCardList
                title="Trending Movies"
                total={trendingMovies.total_results}
                items={prepareMediaList(trendingMovies.results.slice(1))}
                handleViewMore={() => navigate("/movies/trend")}
              />
            </>
          }
          {
            nowPlayingMovies &&
            <AppMediaCardList
              title="Now Playing In Theatres"
              total={nowPlayingMovies.total_results}
              items={prepareMediaList(nowPlayingMovies.results.slice(1))}
              handleViewMore={() => navigate("/movies/now-playing")}
            />
          }

          {
            popularMovies &&
            <AppMediaCardList
              title="Popular Movies"
              total={popularMovies.total_results}
              items={prepareMediaList(popularMovies.results.slice(1))}
              handleViewMore={() => navigate("/movies/popular")}
            />
          }

          {
            topRatedMovies &&
            <AppMediaCardList
              title="Top Rated Movies"
              total={topRatedMovies.total_results}
              items={prepareMediaList(topRatedMovies.results.slice(1))}
              handleViewMore={() => navigate("/movies/top-rated")}
            />
          }
          {
            upcomingMovies &&
            <AppMediaCardList
              title="Upcoming Movies"
              total={upcomingMovies.total_results}
              items={prepareMediaList(upcomingMovies.results.slice(1))}
              handleViewMore={() => navigate("/movies/upcoming")}
            />
          }
        </div>
      )}
    </>
  );
}
