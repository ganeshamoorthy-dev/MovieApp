import { AppMediaCardList } from "@cs/components/app-media-card-list/AppMediaCardList";
import { AppStarContent } from "@cs/components/app-star-content/AppStarContent";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { ImagePath } from "@cs/constants/ImageConstants";
import { TvSeriesService } from "@cs/services/TvSeriesService";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function AppTvSeries()
{
  const [trendingTvSeries, setTrendingTvSeries] = useState();
  const [airingTodayTvSeries, setAiringTodayTvSeries] = useState();
  const [popularTvSeries, setPopularTvSeries] = useState();
  const [topRatedTvSeries, setTopRatedTvSeries] = useState();
  const [airingThisWeekTvSeries, setAiringThisWeekTvSeries] = useState();
  const [loading, setLoading] = useState(true);

  console.log("CHECING ON TV>>>>");
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  useEffect(() =>
  {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trending, airingToday, popular, topRated, airingWeek] = await Promise.all([
          TvSeriesService.getTvTrends(),
          TvSeriesService.getAiringTodayTvSeries(),
          TvSeriesService.getPopularTvSeries(),
          TvSeriesService.getTopRatedTvSeries(),
          TvSeriesService.getAiringWeekTvSeries()
        ]);
        
        setTrendingTvSeries(trending.data);
        setAiringTodayTvSeries(airingToday.data);
        setPopularTvSeries(popular.data);
        setTopRatedTvSeries(topRated.data);
        setAiringThisWeekTvSeries(airingWeek.data);
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
        <AppLoading fullscreen message="Loading TV series..." />
      ) : (
        <div style={{ backgroundColor: "var(--bg-color-3)", paddingBottom: "2rem" }}>
          {
            trendingTvSeries &&
            <>
              <AppStarContent
                title={trendingTvSeries.results.at(0).title}
                bannerImageUrl={ImagePath.BANNER_PATH + trendingTvSeries.results.at(0).backdrop_path}
              >
                <div className="title">
                  {trendingTvSeries.results.at(0).name}
                </div>

                <div className="description">
                  {trendingTvSeries.results.at(0).overview}
                </div>
                <div className="btn">
                  <button
                    type="button"
                    onClick={() => { navigate(`/tv/${ trendingTvSeries.results.at(0).id }`); }}>
                    More Info
                  </button>
                </div>
              </AppStarContent>
              <AppMediaCardList
                title="Trending Tv Series"
                total={trendingTvSeries.total_results}
                items={prepareMediaList(trendingTvSeries.results.slice(1))}
                mediaType={"tv"}
                handleViewMore={() => { navigate("/tv/trend"); }}
              />
            </>
          }
          {
            airingTodayTvSeries &&
            <AppMediaCardList
              title="Airing Today"
              total={airingTodayTvSeries.total_results}
              mediaType={"tv"}
              items={prepareMediaList(airingTodayTvSeries.results.slice(1))}
              handleViewMore={() => { navigate("/tv/today"); }}
            />
          }

          {
            popularTvSeries &&
            <AppMediaCardList
              title="Popular Tv Series"
              total={popularTvSeries.total_results}
              mediaType={"tv"}
              items={prepareMediaList(popularTvSeries.results.slice(1))}
              handleViewMore={() => { navigate("/tv/popular"); }}
            />
          }

          {
            topRatedTvSeries &&
            <AppMediaCardList
              title="Top Rated Tv Series"
              total={topRatedTvSeries.total_results}
              mediaType={"tv"}
              items={prepareMediaList(topRatedTvSeries.results.slice(1))}
              handleViewMore={() => { navigate("/tv/top-rated"); }}
            />
          }
          {
            airingThisWeekTvSeries &&
            <AppMediaCardList
              title="Airing This Week"
              total={airingThisWeekTvSeries.total_results}
              mediaType={"tv"}
              items={prepareMediaList(airingThisWeekTvSeries.results.slice(1))}
              handleViewMore={() => { navigate("/tv/week"); }}
            />
          }
        </div>
      )}
    </>
  );
}
