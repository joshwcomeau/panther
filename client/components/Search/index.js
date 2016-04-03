import React, { Component, PropTypes }  from 'react';
import ReactCSSTransitionGroup          from 'react-addons-css-transition-group';

import SearchBoxContainer       from '../../containers/SearchBoxContainer';
import RecentSearchesContainer  from '../../containers/RecentSearchesContainer';


class Search extends Component {
  componentWillMount() {
    this.props.actions.requestRecentSearches();
  }

  render() {
    return (
      <section id="search">
        <header>Panther</header>
        <h1>Discover new music through an infinite suggestion graph.</h1>
        <h3>Enter the name of an artist you like:</h3>
        <SearchBoxContainer />

        <ReactCSSTransitionGroup
          transitionName="recent-searches"
          transitionEnterTimeout={1500}
          transitionLeaveTimeout={1500}
        >
          { this.props.search.get('recent') ? <RecentSearchesContainer /> : null }
        </ReactCSSTransitionGroup>
      </section>
    );
  }
}
export default Search;
