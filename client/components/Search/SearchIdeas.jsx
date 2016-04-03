import React, { Component, PropTypes } from 'react';


class SearchIdeas extends Component {
  componentWillMount() {
    this.props.actions.requestRecentSearches();
  }

  renderRecentSearches() {
    return this.props.recent.map( (recent, index) => {
      let artistName = recent.name;

      // Append a comma to all artists except the final one.
      const suffix = (this.props.recent.length - index > 1) ? ',' : '';

      return (
        <li key={index}>
          <a onClick={ () => this.props.actions.updateUrl(recent.id) }>
            {artistName}
          </a>
          {suffix}
        </li>
      );
    });
  }

  render() {
    return (
      <div id="search-ideas">
        <h5 className="heading">Recent Searches</h5>
        <ul>
          { this.props.recent ? this.renderRecentSearches() : null }
        </ul>
      </div>
    )
  }
}

export default SearchIdeas;
