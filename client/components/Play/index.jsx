import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


class PlayButton extends Component {
  render() {
    return (
      <svg width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="#000"
          stroke-width="4"
          fill="transparent"
        />
      </svg>
    )
  }
}
