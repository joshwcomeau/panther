import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Howl } from 'howler';
import noop from 'lodash/noop';

import easeInOutCubic from '../../helpers/easing.helpers';



function getInnerSize({size, progressCircleWidth}) {
  return size - progressCircleWidth * 2
}


function getStopIconPoints({ size, progressCircleWidth }) {
  const innerSize = getInnerSize({size, progressCircleWidth});

  return [
    [
      innerSize * 0.3 + progressCircleWidth,
      innerSize * 0.3 + progressCircleWidth
    ], [
      innerSize * 0.3 + progressCircleWidth,
      innerSize * 0.7 + progressCircleWidth
    ], [
      innerSize * 0.7 + progressCircleWidth,
      innerSize * 0.7 + progressCircleWidth
    ], [
      innerSize * 0.7 + progressCircleWidth,
      innerSize * 0.3 + progressCircleWidth
    ]
  ];
}

function getPlayIconPoints({ size, progressCircleWidth }) {
  const innerSize = getInnerSize({size, progressCircleWidth});

  return [
    [
      innerSize * 7/20 +  progressCircleWidth,
      innerSize * 1/4  +  progressCircleWidth
    ], [
      innerSize * 7/20 +  progressCircleWidth,
      innerSize * 3/4  +  progressCircleWidth
    ], [
      innerSize * 31/40 + progressCircleWidth,
      innerSize * 1/2   + progressCircleWidth
    ], [
      innerSize * 31/40 + progressCircleWidth,
      innerSize * 1/2   + progressCircleWidth
    ]
  ];
}

class PlayButton extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    audioId: PropTypes.string

  }

  static defaultProps = {
    stopIconColor: '#FFFFFF',
    playIconColor: '#FFFFFF',
    iconAnimationLength: 1000
  }

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      playing: false,
      loading: true,
      iconPoints: getPlayIconPoints(props)
    };

    this.howler = new Howl({
      src:    [ this.props.url ],
      format: 'mp3',
      onend:  this.props.stop
    });

    this.updateProgress = this.updateProgress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.active && !nextProps.active ) {
      this.setState({ progress: 0, playing: false })
      this.howler.stop();
    } else if ( !this.props.active && nextProps.active ) {
      this.setState({ progress: 0 }, this.updateProgress)
      this.howler.play();
      this.animatePlayIcon();
    }
  }

  componentWillUnmount() {
    this.howler.unload();
  }

  clickHandler() {
    this.props.active ? this.props.stop() : this.props.play(this.props.audioId);
  }

  updateProgress() {
    // Stop immediately if this button is no longer active
    if ( !this.props.active ) return;

    window.requestAnimationFrame( () => {
      this.setState({
        progress: (this.howler.seek() * 1000) / this.props.duration
      })

      this.updateProgress();
    });
  }

  animatePlayIcon() {
    const easingFunction = easeInOutCubic;
    const startTime = new Date().getTime();
    const initialPoints = this.state.iconPoints;

    const updatePosition = () => {
      // IF we stopped the track, stop animating!
      if ( !this.state.playing ) return;

      requestAnimationFrame( () => {
        const time = new Date().getTime() - startTime;

        // Our end condition. The time has elapsed, the animation is completed.
        if ( time > this.props.iconAnimationLength ) return;

        // Let's figure out where the new points should be


      });
    }
  }

  getPolygonPoints({ active, size, progressCircleWidth }) {
    const innerSize = size - progressCircleWidth * 2;
    let points;

    if ( active ) {
      // Stop icon points
      points = [
        [
          innerSize * 0.3 + progressCircleWidth,
          innerSize * 0.3 + progressCircleWidth
        ], [
          innerSize * 0.3 + progressCircleWidth,
          innerSize * 0.7 + progressCircleWidth
        ], [
          innerSize * 0.7 + progressCircleWidth,
          innerSize * 0.7 + progressCircleWidth
        ], [
          innerSize * 0.7 + progressCircleWidth,
          innerSize * 0.3 + progressCircleWidth
        ]
      ];
    } else {
      // Play icon points
      points = [
        [
          innerSize * 7/20 +  progressCircleWidth,
          innerSize * 1/4  +  progressCircleWidth
        ], [
          innerSize * 7/20 +  progressCircleWidth,
          innerSize * 3/4  +  progressCircleWidth
        ], [
          innerSize * 31/40 + progressCircleWidth,
          innerSize * 1/2   + progressCircleWidth
        ]
      ];
    }

    return points.map(p => p.join(',')).join(' ');
  }

  renderIcon() {
    const { active, playIconColor, stopIconColor } = this.props;
    const points = this.getPolygonPoints(this.props);

    return (
      <polygon
        points={points}
        style={{ cursor: 'pointer' }}
        fill={active ? playIconColor : stopIconColor}
      />
    );
  }

  renderMainCircle() {
    const {
      size,
      progressCircleWidth,
      progressCircleColor,
      idleBackgroundColor,
      activeBackgroundColor
    } = this.props;

    const radius = size / 2;

    return (
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        style={{ cursor: 'pointer' }}
        fill={this.props.active ? activeBackgroundColor : idleBackgroundColor}
      />
    );
  }

  renderProgressBar() {
    const {
      size,
      progressCircleWidth,
      progressCircleColor,
      idleBackgroundColor,
      activeBackgroundColor
    } = this.props;

    const center = size / 2;
    const diameter = size - progressCircleWidth;
    const radius = diameter / 2;
    const circumference = diameter * Math.PI;
    const progressWidth = Math.floor(1 - (1 - this.state.progress) * circumference);

    const circlePath = `
      M ${center}, ${center}
      m 0, -${radius}
      a ${radius},${radius} 0 1,0 0,${diameter}
      a ${radius},${radius} 0 1,0 0,-${diameter}
    `;

    return (
      <path
        d={circlePath}
        stroke={progressCircleColor}
        stroke-width={progressCircleWidth}
        stroke-dasharray={circumference}
        stroke-dashoffset={progressWidth}
        style={{ cursor: 'pointer' }}
        fill="transparent"
      />
    );
  }

  render() {
    const { size, active } = this.props;

    return (
      <svg width={size} height={size} onClick={::this.clickHandler}>
        { this.renderMainCircle() }
        { active ? this.renderProgressBar() : null }
        { this.renderIcon() }
      </svg>
    )
  }
}

export default PlayButton
