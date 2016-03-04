import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Edges extends Component {
  renderEdges() {
    return this.props.edges.map( (edge, i) => {
      const classes = classNames({
        retracting: edge.retracting,
        expanding:  edge.expanding,
        pulling:    edge.pulling
      });

      let styles = {};

      if ( edge.pulling || edge.retracting ) {
        styles.strokeDasharray  =  edge.length,
        styles.strokeDashoffset =  edge.length
      }

      return <line
        key={i}
        className={classes}
        style={styles}
        {...edge}
      />;
    })
  }

  render() {
    return (
      <svg id="edges">
        { this.renderEdges() }
      </svg>
    )
  }
}

export default Edges;
