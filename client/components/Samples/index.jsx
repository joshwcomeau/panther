import React, { Component, PropTypes } from 'react';

import PlayButton from './PlayButton.jsx';


const Samples = ({ tracks, playing, artistVisible, actions}) => {
  console.log("Mapping through tracks", tracks.toJS())
  const buttons = tracks.map( (track, index) => {
    let styles;

    if ( artistVisible ) {
      styles = {
        opacity: 0,
        animationName: 'fadeIn',
        animationFillMode: 'forwards',
        animationDuration: '600ms',
        animationTimingFunction: 'ease',
        animationDelay: `${index*50}ms`
      }
    } else {
      styles = {
        opacity: 1,
        animationName: 'drop',
        animationFillMode: 'forwards',
        animationDuration: '600ms',
        animationTimingFunction: 'ease',
        animationDelay: `${index*50}ms`
      };
    }

    console.log("ID", track.get('id'))

    return (
      <span className="button-wrapper" style={styles} key={track.get('id')}>
        <PlayButton
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
      </span>
    )
  });

  return (
    <div id="samples">
      { buttons }
    </div>
  );
}

export default Samples;
