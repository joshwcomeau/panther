import React, { Component, PropTypes } from 'react';

import ArtistAvatar from './ArtistAvatar.jsx';
import SamplesContainer from '../../containers/SamplesContainer';


class ArtistInfo extends Component {


  render() {
    return (
      <div id="artist-info">
        <ArtistAvatar images={this.props.artist.get('images')} />
        <div className="node-spacer" />
        <SamplesContainer />
      </div>
    )
  }
}

export default ArtistInfo;
