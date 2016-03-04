import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { calculateLineLength } from '../../helpers/graph.duck.helpers';


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
        const edgeLength = calculateLineLength(edge.x1, edge.y1, edge.x2, edge.y2);
        styles.strokeDasharray  =  edgeLength,
        styles.strokeDashoffset =  edgeLength
      }

      console.log("Edges rendering", performance.now())

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
        { this.props.edges ? this.renderEdges() : null }
      </svg>
    )
  }
}

export default Edges;
