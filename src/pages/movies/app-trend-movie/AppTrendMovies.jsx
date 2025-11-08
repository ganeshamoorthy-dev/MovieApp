import { AppViewMore } from "@cs/components/app-view/AppViewMore";
import AppLoading from "@cs/components/app-loading/AppLoading";
import { ImagePath } from "@cs/constants/ImageConstants";
import { MovieService } from "@cs/services/MovieService";
import { useErrorHandler } from "@cs/hooks/useErrorHandler";
import { Component } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

class AppTrendMoviesWrapper extends Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      trendMoviesList: [],
      currentPage: 1,
      isLodMore: true,
      loading: true
    };
  }

  componentDidMount()
  {
    this.getTrendMovies();
  }

  async getTrendMovies()
  {
    try {
      this.setState({ loading: true });
      const response = await MovieService.getMovieTrends(this.state.currentPage);
      const isLoadMore = this.state.currentPage === response.total_pages - 1;
      this.setState((prevState) => (
        {
          ...prevState,
          isLoadMore: isLoadMore,
          trendMoviesList: prevState.trendMoviesList.concat(response.data.results),
          loading: false
        }
      ));
    } catch (error) {
      this.props.handleError(error);
    }
  }


  handleLoadMore = () =>
  {
    this.setState((prevState) => ({
      ...prevState, currentPage: prevState.currentPage + 1
    }), () => this.getTrendMovies());
  };

  handlePosterClick(id)
  {
    this.props.navigate(`/movies/${ id }`);
  }

  prepareMediaList()
  {
    return this.state.trendMoviesList.map((movie) => (
      {
        id: movie.id,
        title: movie.title,
        posterImageUrl: ImagePath.POSTER_PATH + movie.poster_path,
      }));
  }

  render()
  {

    return (
      <>
        {this.state.loading && this.state.trendMoviesList.length === 0 ? (
          <AppLoading fullscreen message="Loading trending movies..." />
        ) : (
          <>
            {this.state.trendMoviesList.length > 0 && <AppViewMore
              title="Trending Movies"
              items={this.prepareMediaList()}
              isLoadMore={this.state.isLodMore}
              handleLoadMore={this.handleLoadMore}
              handlePosterClick={this.handlePosterClick.bind(this)} />
            }
            {this.state.loading && this.state.trendMoviesList.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-color-3)' }}>
                <AppLoading size="large" message="Loading more..." />
              </div>
            )}
          </>
        )}
      </>

    );
  }
}

const HOC = (Component) =>
{

  const WrappedComponent = (props) =>
  {
    const navigate = useNavigate();
    const { handleError } = useErrorHandler();
    return <Component {...props} navigate={navigate} handleError={handleError} />;
  };
  return WrappedComponent;
};

const AppTrendMovies = HOC(AppTrendMoviesWrapper);

export default AppTrendMovies;

AppTrendMoviesWrapper.propTypes = {
  navigate: PropTypes.func,
  handleError: PropTypes.func
};
