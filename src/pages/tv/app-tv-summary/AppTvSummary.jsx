import { Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import { AppMediaViewContent } from "@cs/components/app-media-view-content/app-media-view-content";
import { AppStarContent } from "@cs/components/app-star-content/AppStarContent";
import { ImagePath } from "@cs/constants/ImageConstants";
import { AppMediaCardList } from "@cs/components/app-media-card-list/AppMediaCardList";
import { AppCastCrew } from "@cs/components/app-cast-crew/AppCastCrew";
import { TvSeriesService } from "@cs/services/TvSeriesService";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";

export function AppTvSeriesSummary()
{

  const params = useParams();
  const [tvSeriesDetails, setTvSeriesDetails] = useState();
  const [tvSeriesCredits, setTvCredits] = useState();
  const [tvSeriesVideos, setTvVideos] = useState();
  const [tvSeriesRecommendations, setTvSeriesRecommendations] = useState();
  const [tvSeriesSimilar, setTvSimilarMovies] = useState();
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();


  // const [airingTodayTvSeries, setAiringTodayTvSeries] = useState();
  // const [currentWeekTvSeries, setCurrentWeekTvSeries] = useState();
  // const [popularTvSeries, setPopularTvSeries] = useState();
  // const [topRatedTvSeries, setTopRatedTvSeries] = useState();



  useEffect(() =>
  {
    const fetchTvData = async () => {
      try {
        setLoading(true);
        const [detailsRes, creditsRes, videosRes, similarRes, recommendationsRes] = await Promise.all([
          TvSeriesService.getTvSeriesDetails(params.id),
          TvSeriesService.getAggregateCredits(params.id),
          TvSeriesService.getTvSeriesVideos(params.id),
          TvSeriesService.getSimilarTvSeries(params.id),
          TvSeriesService.getRecommendedTvSeries(params.id)
        ]);

        setTvSeriesDetails(detailsRes.data);
        setTvCredits(creditsRes.data);
        setTvVideos(videosRes.data);
        setTvSimilarMovies(similarRes.data);
        setTvSeriesRecommendations(recommendationsRes.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvData();
  }, [params.id, handleError]);


  const prepareMovieData = (movieList) =>
  {
    return movieList.filter((movie) => movie.poster_path && movie.backdrop_path)
      .map((movie) =>
      {
        return {
          id: movie.id,
          title: movie.name,
          posterImageUrl: ImagePath.BANNER_PATH + movie.poster_path,
          bannerImageUrl: ImagePath.BANNER_PATH + movie.backdrop_path,
        };
      });

  };


  return (
    <>
      {loading && <AppLoading fullscreen text="Loading TV series details..." size="large" />}
      
      {!loading && (
        <div style={{ backgroundColor: "var(--bg-color-3)", paddingBottom: "2rem" }}>
          {tvSeriesDetails && tvSeriesCredits &&
            <AppStarContent
              bannerImageUrl={ImagePath.BANNER_PATH + tvSeriesDetails.backdrop_path}
              title={tvSeriesDetails.name}
              description={tvSeriesDetails.overview}
              id={tvSeriesDetails.id}>

              <AppMediaViewContent
                posterImageUrl={ImagePath.BANNER_PATH + tvSeriesDetails.poster_path}
                title={tvSeriesDetails.name}
                rating={tvSeriesDetails.vote_average}
                description={tvSeriesDetails.overview}
                noOfSeasons={tvSeriesDetails.number_of_seasons}
                noOfEpisodes={tvSeriesDetails.number_of_episodes}
                director={tvSeriesDetails.created_by.slice(0, 4).map(crew => crew.name).join(", ") ?? "-"}
                cast={tvSeriesCredits.cast.filter(crew => crew.known_for_department === "Acting").slice(0, 4).map(crew => crew.name).join(", ")}
                genres={tvSeriesDetails.genres}
                releaseDate={tvSeriesDetails.first_air_date}
              />
            </AppStarContent>
          }

          {tvSeriesVideos?.results?.length > 0 &&
            <AppMediaCardList
              items={tvSeriesVideos?.results}
              title="Videos"
              mediaType="tv"
              isVideo={true}
              isViewMore={false}
            />
          }

          {tvSeriesRecommendations &&
            <AppMediaCardList
              items={prepareMovieData(tvSeriesRecommendations.results)}
              title="Recommendations"
              isViewMore={false}
              mediaType="tv"
            />
          }

          {tvSeriesSimilar?.results?.length > 0 &&
            <AppMediaCardList
              items={prepareMovieData(tvSeriesSimilar.results)}
              title="Similar Movies"
              mediaType="tv"
              isViewMore={false} />
          }

          {tvSeriesCredits && <AppCastCrew credits={tvSeriesCredits} />}

          <Outlet />
        </div>
      )}
    </>
  );
}
