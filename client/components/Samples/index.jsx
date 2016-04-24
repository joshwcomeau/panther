import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';

import PlayButton from 'react-play-button';
import TrackName from './TrackName.jsx';
import immutableProps from '../immutable_props.jsx';

@immutableProps
class Samples extends Component {
  componentWillMount() {
    this.setState({
      // We want to disable the animations the first time it renders,
      // so we don't see it transition away on load.
      enableButtonAnimation: false
    })
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.visible )
      this.setState({
        enableButtonAnimation: true
      })
  }

  renderButtons() {
    const { tracks, playing, visible, actions } = this.props;

    return tracks.map( (track, index) => {
      let styles = {};

      if ( this.state.enableButtonAnimation ) {
        if ( visible ) {
          styles = {
            opacity: 0,
            animationName: 'button-enter',
            animationFillMode: 'forwards',
            animationDuration: '600ms',
            animationTimingFunction: 'ease',
            animationDelay: `${500 + index*50}ms`
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
      }

      return (
        <span className="button-wrapper" style={styles} key={track.get('id')}>
          <PlayButton
            audioId={track.get('id')}
            url={track.get('url')}
            active={track.get('id') === playing}
            size={60}
            progressCircleWidth={5}
            progressCircleColor="#78A931"
            idleBackgroundColor="#191b1d"
            activeBackgroundColor="#191b1d"
            play={actions.playTrack}
            stop={actions.stop}
            fadeInLength={250}
            fadeOutLength={250}
          />
        </span>
      );
    });
  }

  renderTrackName() {
    const { tracks, playing } = this.props;

    const track = tracks.find( t => t.get('id') === playing );

    return (
      <ReactCSSTransitionGroup
        transitionName="track-name"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
      >
        { playing ? <TrackName name={track.get('name')} /> : null }
      </ReactCSSTransitionGroup>
    );
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
