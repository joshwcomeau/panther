import React, { Component, PropTypes } from 'react';

import ArtistAvatar from './ArtistAvatar.jsx';
import SamplesContainer from '../../containers/SamplesContainer';


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


  render() {
    return (
      <div id="artist-info">
        <ArtistAvatar src={this.getSmallestAcceptableImage()} />
        <div className="node-spacer" />
        <SamplesContainer />
      </div>
    )
  }
}

export default ArtistInfo;
