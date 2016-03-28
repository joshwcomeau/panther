import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { calculateLineLength } from '../../helpers/graph.helpers';
import {
  edgesRetractLength,
  edgesRetractDelay,
  edgesExpandLength
} from '../../config/timing';


class Edge extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shouldExtend: true
    }
  }

  componentWillReceiveProps(nextProps) {
    // If we've received new props, but our state of 'expanding' hasn't changed,
    // we don't need to re-animate the expansion.
    this.setState({
      shouldExtend: this.props.expanding === undefined
    });
  }

  render() {
    const { retracting, expanding, x1, y1, x2, y2 } = this.props;

    const classes = classNames({ retracting, expanding });
    let styles = {};

    // If `expanding` is undefined, it means it hasn't yet been "activated".
    // Don't show it.
    if ( typeof expanding === 'undefined' && typeof retracting === 'undefined') {
      return <line />
    }

    if ( retracting ) {
      styles = setDashStyles(x1, y1, x2, y2);
      styles.animationName            = 'retract';
      styles.animationDirection       = 'reverse';
      styles.animationTimingFunction  = 'ease';
      styles.animationDuration        = edgesRetractLength+'ms';
      styles.animationDelay           = edgesRetractDelay+'ms';
      styles.animationFillMode        = 'both';
    }

    else if ( expanding && this.state.shouldExtend ) {
      styles = setDashStyles(x1, y1, x2, y2);
      styles.animationName            = 'expand';
      styles.animationDirection       = 'reverse';
      styles.animationTimingFunction  = 'ease';
      styles.animationDuration        = edgesExpandLength+'ms';
      styles.animationDelay           = edgesRetractDelay+'ms';
      styles.animationFillMode        = 'both';
    }

    return <line
      className={classes}
      style={styles}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    />;
  }
};

function setDashStyles(x1, y1, x2, y2, styles = {}) {
  const edgeLength = calculateLineLength(x1, y1, x2, y2);
  styles.strokeDasharray  =  edgeLength;
  styles.strokeDashoffset =  edgeLength;

  return styles;
}

export default Edge;
