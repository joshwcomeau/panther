import React, { Component, PropTypes } from 'react';

class Edges extends Component {
  renderEdges() {
    return this.props.edges.map( (edge, i) => {
      return <line key={i} {...edge} />;
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
