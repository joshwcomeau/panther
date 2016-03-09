import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Howl } from 'howler';
import noop from 'lodash/noop';


class PlayButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };

    this.howler = new Howl({
      urls: [ this.props.url ],
      format: 'mp3'
    });

    this.updateProgress = this.updateProgress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.active && !nextProps.active ) {
      this.setState({ progress: 0 })
      this.howler.stop();
      clearInterval(this.progressInterval);
    } else if ( !this.props.active && nextProps.active ) {
      this.setState({ progress: 0 })
      this.howler.play();
      this.progressInterval = setInterval(this.updateProgress, 1000);
    }
  }

  componentWillUnmount() {
    this.howler.unload();
    clearInterval(this.progressInterval);
  }

  clickHandler() {
    this.props.active ? this.props.stop() : this.props.play(this.props.audioId);
  }

  updateProgress() {
    this.setState({
      progress: (this.howler.pos() * 1000) / this.props.duration
    })
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
        fill={idleBackgroundColor}
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
    const progressWidth = 1- (1 - this.state.progress) * circumference;

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
        fill="transparent"
        transition="1s"
      />
    );
  }

  render() {
    const { size } = this.props;

    return (
      <svg width={size} height={size} onClick={::this.clickHandler}>
        { this.renderMainCircle() }
        { this.props.active ? this.renderProgressBar() : null }
        { this.props.active ? this.renderStopButton() : this.renderPlayButton() }
      </svg>
    )
  }
}

export default PlayButton
