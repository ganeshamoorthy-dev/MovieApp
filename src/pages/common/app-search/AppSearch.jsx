import { AppViewMore } from "@cs/components/app-view/AppViewMore";
import { ImagePath } from "@cs/constants/ImageConstants";
import { useSearchParams } from "@cs/hooks/useSearchQueryParams";
import { SearchService } from "@cs/services/searchService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";

export function AppSearch()
{
  const query = useSearchParams().get("query");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const [searchData, setSearchData] = useState([]);

  useEffect(() =>
  {
    setSearchData([]);
    setCurrentPage(1);
  }, [query]);

  useEffect(() =>
  {
    setLoading(true);
    SearchService.getSearchResult(query, currentPage)
      .then((response) =>
      {
        const isLoadMore = currentPage <= response.data?.total_pages - 1;
        setIsLoadMore(isLoadMore);
        const data = response.data.results.filter((data) => data.media_type !== "person" && data.poster_path)
          .map((item) => ({
            id: item.id,
            posterImageUrl: ImagePath.POSTER_PATH + item.poster_path,
            title: item.title,
            mediaType: item.media_type
          }
          ));
        setSearchData((prevData) => prevData.concat(data));
      })
      .catch((error) => handleError(error))
      .finally(() => setLoading(false));
  }, [currentPage, query, handleError]);


  return (
    <>
      {loading && searchData.length === 0 ? (
        <AppLoading fullscreen message={`Searching for "${query}"...`} />
      ) : (
        <>
          {searchData.length > 0 &&
            <AppViewMore
              title={`Shown Results for ${query}`}
              items={searchData}
              isLoadMore={isLoadMore}
              handleLoadMore={() => setCurrentPage((prevValue) => prevValue + 1)}
              handlePosterClick={(id, mediaType) => navigate(`/${mediaType === "movie" ? "movies" : "tv"}/${id}`)}
            />
          }
          {loading && searchData.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-color-3)' }}>
              <AppLoading size="large" message="Loading more results..." />
            </div>
          )}
        </>
      )}
    </>
  );
}
