import React, { Component, PropTypes } from 'react';

import PlayButton from './PlayButton.jsx';


const Samples = ({ tracks, playing, actions}) => {
  console.log("Samples has tracs", tracks.toJS())
  const buttons = tracks.map( track => (
    <PlayButton
      key={track.get('id')}
      audioId={track.get('id')}
      duration={30000}
      url={track.get('url')}
      active={track.get('id') === playing}
      size={60}
      progressCircleWidth={5}
      progressCircleColor="#1888C8"
      idleBackgroundColor="#191b1d"
      activeBackgroundColor="#191b1d"
      play={actions.playTrack}
      stop={actions.stop}
    />
  ))

  return (
    <div className="play-buttons">
      { buttons }
    </div>
  );
}

export default Samples;
