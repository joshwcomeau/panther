import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


class PlayButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  renderStopButton() {
    return (
      <g>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 6h12v12H6z"/>
      </g>
    );
  }

  renderPlayButton() {
    // Our play button will be 1/3rd the height and 1/4th the width.
    const { size, progressCircleWidth } = this.props;
    const innerSize = size - progressCircleWidth * 2;

    const p1 = [
      innerSize * 7/20 +  progressCircleWidth,
      innerSize * 1/4 +   progressCircleWidth
    ];
    const p2 = [
      innerSize * 7/20 +  progressCircleWidth,
      innerSize * 3/4 +   progressCircleWidth
    ];
    const p3 = [
      innerSize * 31/40 + progressCircleWidth,
      innerSize * 1/2 +   progressCircleWidth
    ];

    const points = [p1, p2, p3].map(p => p.join(',')).join(' ');

    return (
      <polygon points={points} fill={this.props.playIconColor} />
    );
  }

  render() {
    const {
      size,
      progressCircleWidth,
      progressCircleColor,
      idleBackgroundColor,
      activeBackgroundColor
    } = this.props;

    const center = size / 2;
    const radius = center - progressCircleWidth / 2;

    return (
      <svg width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressCircleColor}
          strokeWidth={progressCircleWidth}
          fill={idleBackgroundColor}
        />
        { this.state ? this.renderStopButton() : this.renderPlayButton() }
      </svg>
    )
  }
}

export default PlayButton
