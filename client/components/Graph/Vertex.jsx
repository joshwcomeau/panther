import React, { Component } from 'react';
import classNames from 'classnames';

import VertexShadow from './VertexShadow.jsx';


class Vertex extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    // TODO
    return;


    // Ignore clicks on the present node.
    if ( this.props.group === PRESENT ) return;

    // If we click a node in the FUTURE, we're going forwards.
    // If we click a node in the PAST, we're going backwards.
    const direction = this.props.group === FUTURE ? 'forwards' : 'backwards';

    this.props.clickVertex(this.props.data, direction);
  }

  render() {
    const { radius, x, y, artist } = this.props;
    const artistName = artist.get('name');

    const shadowFilterId = 'drop-shadow';

    return (
      <g>
        <VertexShadow id={shadowFilterId} />
        <svg
          width={radius * 2}
          height={radius * 2}
          x={x}
          y={y}
          filter={`url(#${shadowFilterId})`}
        >
          <circle cx="50%" cy="50%" r="48%" fill="#FFFFFF" />

          <text x="50%" y="50%" text-anchor="middle">{artistName}</text>
        </svg>
      </g>
    );
  }
}

export default Vertex;
