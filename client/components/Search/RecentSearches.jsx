import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class RecentSearches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  clickHandler(id) {
    this.setState({ selected: id })
    this.props.actions.updateUrl(id)
  }

  renderItems() {
    return this.props.recent.map( (recent, index) => {
      let artistName = recent.name;

      // Append a comma to all artists except the final one.
      const isLastItem = this.props.recent.length - index > 1;

      const isHidden = this.state.selected && this.state.selected !== recent.id;
      const classes = classNames({
        faded: isHidden
      });

      return (
        <li key={index} className={classes}>
          <a onClick={ () => this.clickHandler(recent.spotifyArtistId) }>
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
