import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';

import { repositionLength } from '../../config/timing';
import { repositionEasing } from '../../config/easing';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vertices: fromJS([
        { id: 'a', cx: 600, cy: 150, r: 75},
        { id: 'b', cx: 600, cy: 300, r: 75},
        { id: 'c', cx: 600, cy: 450, r: 75}
      ])
    };
  }

  moveTo(ev) {
    animateShapes(this.state, ::this.setState, {
      vertices: this.state.vertices.map( v => v.update('cx', cx => cx + 25))
    }, 1000)
  }

  render() {
    const { vertices, edges, actions } = this.props;

    return (
      <svg id="graph" onClick={(ev) => this.moveTo(ev)}>
        {
          this.state.vertices.map( (v, i) => {
            return (
              <svg
                key={i}
                width={v.get('r') * 2}
                height={v.get('r') * 2}
                x={v.get('cx')}
                y={v.get('cy')}
              >
                <circle
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fill="#ABCDEF"
                />
                <text x="50%" y="50%" text-anchor="middle">Hello!</text>
              </svg>
            )
          })
        }
      </svg>
    );
  }
};

function animateShapes(origin, setState, final, duration, easingFunction = easeInOutQuart) {
  const startTime = new Date().getTime();

  function updatePosition() {
    requestAnimationFrame( () => {
      const time = new Date().getTime() - startTime;

      // Figure out the new center points for our vertices
      const newVertices = origin.vertices.map( (vertex, vertexIndex) => {
        // TODO: Replace these with .find calls, since we won't be guaranteed
        // that the index is the same.
        const originVertex  = origin.vertices.get(vertexIndex);
        const finalVertex   = final.vertices.get(vertexIndex);

        vertex = vertex
          .set('cx', easingFunction(
            time,
            originVertex.get('cx'),
            finalVertex.get('cx') - originVertex.get('cx'),
            duration
          ))
          .set('cy', easingFunction(
            time,
            originVertex.get('cy'),
            finalVertex.get('cy') - originVertex.get('cy'),
            duration
          ));

        return vertex;
      });


      setState({
        vertices: newVertices
      }, () => {
        if ( time < duration ) updatePosition();
      });
    });
  }

  updatePosition();
}

//  t: current time
//  b: beginning value
//  c: change in value
//  d: duration
//
function easeInOutQuart(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

function linear(t, b, c, d) {
  if ( t > d ) return b + c;
  const ratio = t / d;
  return b + (c * ratio);
}


export default Graph;
