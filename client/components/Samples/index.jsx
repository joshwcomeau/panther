import React, { Component, PropTypes } from 'react';

import PlayButton from './PlayButton.jsx';
import TrackName from './TrackName.jsx';
import immutableProps from '../immutable_props.jsx';

@immutableProps(['playing', 'visible'])
class Samples extends Component {
  renderButtons() {
    const { tracks, playing, visible, actions } = this.props;

    return tracks.map( (track, index) => {
      let styles;

      if ( visible ) {
        styles = {
          opacity: 0,
          animationName: 'button-enter',
          animationFillMode: 'forwards',
          animationDuration: '600ms',
          animationTimingFunction: 'ease',
          animationDelay: `${index*50}ms`
        }
      } else {
        styles = {
          opacity: 1,
          animationName: 'button-exit',
          animationFillMode: 'forwards',
          animationDuration: '600ms',
          animationTimingFunction: 'ease',
          animationDelay: `${index*50}ms`
        };
      }

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
      );
    });
  }

  renderTrackName() {
    const { tracks, playing } = this.props;
    if ( !playing ) return null;

    const track = tracks.find( t => t.get('id') === playing );

    return <TrackName name={track.get('name')} />
  }

  render() {
    return (
      <div id="samples-wrapper">
        <div className="node-spacer" />
        <div id="samples">
          { this.renderButtons() }
          { this.renderTrackName() }
        </div>
      </div>
    );
  }
}

export default Samples;
