import React, { Component, PropTypes } from 'react';


class SearchIdeas extends Component {
  render() {
    return (
      <div id="search-ideas">
        <h5 className="heading">Recent Searches</h5>
        <ul>
          <li><a>Daft Punk</a>, </li>
          <li><a>Deadmau5</a>, </li>
          <li><a>Tiesto</a>, </li>
          <li><a>Kelly Clarkson</a></li>
        </ul>
      </div>
    )
  }
}

export default SearchIdeas;
