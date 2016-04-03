import React, { Component, PropTypes } from 'react';


class RecentSearches extends Component {
  renderItems() {
    return this.props.recent.map( (recent, index) => {
      let artistName = recent.name;

      // Append a comma to all artists except the final one.
      const isLastItem = this.props.recent.length - index > 1;

      return (
        <li key={index}>
          <a onClick={ () => this.props.actions.updateUrl(recent.id) }>
            {artistName}
          </a>
          {isLastItem ? ',' : '.'}
        </li>
      );
    });
  }

  render() {
    return (
      <div id="recent-searches">
        <h5 className="heading">Recent Searches</h5>
        <ul>
          { this.props.recent ? this.renderItems() : null }
        </ul>
      </div>
    );
  }
}

export default RecentSearches;
