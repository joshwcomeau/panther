import React, { Component } from 'react';
import classNames from 'classnames';

import { GRAVEYARD, PAST, PRESENT, FUTURE } from '../../config/regions';

import VertexShadow from './VertexShadow.jsx';


class Vertex extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    switch (this.props.region) {
      case FUTURE:
        return this.props.actions.selectArtist(this.props.artist);
      case PAST:
        // TODO
    }
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
          onClick={this.clickHandler}
        >
          <circle cx="50%" cy="50%" r="48%" fill="#FFFFFF" />

          <text x="50%" y="50%" text-anchor="middle">{artistName}</text>
        </svg>
      </g>
    );
  }
}

export default Vertex;
