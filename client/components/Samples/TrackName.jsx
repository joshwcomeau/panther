import React, { Component, PropTypes } from 'react';


const TrackName = ({name}) => (
  <div id="track-name">
    <h6>Now Playing</h6>
    <h4>{name}</h4>
  </div>
);

TrackName.propTypes = {
  name: PropTypes.string.isRequired
}

export default TrackName;
