import React, { Component, PropTypes } from 'react';
import ArtistAvatar from './ArtistAvatar.jsx';

class ArtistInfo extends Component {
  getSmallestAcceptableImage() {
    const images = this.props.artist.get('images');
    const minWidth = window.innerWidth / 3;
    let image = images.reverse().find( image => {
      console.log("min width is", minWidth, "image is", image.get('width'))
      return image.get('width') > minWidth
    });

    if ( !image ) image = images.get(0);

    return image.get('url');
  }
  render() {
    console.log("Artist info props", this.props.artist.toJS());
    return (
      <div id="artist-info">
        <ArtistAvatar src={this.getSmallestAcceptableImage()} />
        <div className="node-spacer" />
        <div className="play-buttons" />
      </div>
    )
  }
}

export default ArtistInfo;
