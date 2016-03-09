import React, { Component, PropTypes } from 'react';

import PlayButton from './PlayButton.jsx';


const Samples = ({ tracks, playing, actions}) => {
  console.log("Samples has tracs", tracks)
  const buttons = tracks.map( (track, index) => (
    <PlayButton
      key={index}
      url={track.get('url')}
      duration={track.get('duration')}
      size={60}
      progressCircleWidth={5}
      progressCircleColor="#78A931"
      idleBackgroundColor="#191b1d"
      activeBackgroundColor="#A9402D"
      playIconColor="#FFFFFF"
      stopIconColor="#FFFFFF"
    />
  ))

  return (
    <div className="play-buttons">
      { buttons }
    </div>
  );
}

export default Samples;
