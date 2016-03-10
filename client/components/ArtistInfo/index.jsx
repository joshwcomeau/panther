import React, { Component, PropTypes } from 'react';

import ArtistAvatarContainer  from '../../containers/ArtistAvatarContainer';
import SamplesContainer       from '../../containers/SamplesContainer';


class ArtistInfo extends Component {


  render() {
    return (
      <div id="artist-info">
        <ArtistAvatarContainer />
        <div className="node-spacer" />
        <SamplesContainer />
      </div>
    )
  }
}

export default ArtistInfo;
