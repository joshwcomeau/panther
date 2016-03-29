import React, { Component } from 'react';
import classNames from 'classnames';

import { GRAVEYARD, PAST, PRESENT, FUTURE } from '../../config/regions';
import { vertexEnterLength, vertexExitLength } from '../../config/timing';

import VertexShadow from './VertexShadow.jsx';


class Vertex extends Component {
  constructor() {
    super()
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    return this.props.actions.updateArtistUrl(this.props.artist.get('id'));
  }

  render() {
    const { region, radius, x, y, rejected, selected, artist } = this.props;
    const artistName = artist.get('name');

    console.log("Vertex is selected", selected)

    const shadowFilterId = 'drop-shadow';

    const classes = classNames([ 'vertex', region.toLowerCase(), { rejected } ]);
    let styles = {}

    if ( rejected ) {
      styles.animationName = 'rejected';
      styles.animationDuration = vertexExitLength+'ms';
      styles.animationFillMode = 'forwards';
      styles.animationTimingFunction = 'ease';
    } else {
      styles.animationName = 'fadeIn';
      styles.animationDuration = vertexEnterLength+'ms';
      styles.animationFillMode = 'forwards';
      styles.animationTimingFunction = 'ease';
    }

    return (
      <g>
        <VertexShadow id={shadowFilterId} />
        <svg
          width={radius * 2}
          height={radius * 2}
          x={x}
          y={y}
          onClick={this.clickHandler}
        >
          <g className={classes} style={styles}>
            <circle cx="50%" cy="50%" r="48%" fill="#FFFFFF" />
            <text x="50%" y="51%" textAnchor="middle">{artistName}</text>
          </g>
        </svg>
      </g>
    );
  }
}

export default Vertex;
