import React, { Component, PropTypes } from 'react';

import ArtistAvatar from './ArtistAvatar.jsx';
import Play from './Play';


class ArtistInfo extends Component {
  getSmallestAcceptableImage() {
    const images = this.props.artist.get('images');
    const minWidth = window.innerWidth / 3;
    let image = images.reverse().find( image => {
      return image.get('width') > minWidth
    });

    if ( !image ) image = images.get(0);

    return image.get('url');
  }

  renderPlayButtons() {
    return [1, 2, 3].map( track => (
      <Play
        key={track}
        size={60}
        progressCircleWidth={5}
        progressCircleColor="#78A931"
        idleBackgroundColor="#191b1d"
        activeBackgroundColor="#A9402D"
        playIconColor="#FFFFFF"
        stopIconColor="#FFFFFF"
      />
    ))
  }

  render() {
    console.log("Artist info props", this.props.artist);
    return (
      <div id="artist-info">
        <ArtistAvatar src={this.getSmallestAcceptableImage()} />
        <div className="node-spacer" />
        <div className="play-buttons">
          { this.renderPlayButtons() }
        </div>
      </div>
    )
  }
}

export default ArtistInfo;
