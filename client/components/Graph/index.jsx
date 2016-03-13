import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import min from 'lodash/min'

import { GRAVEYARD, PAST, PRESENT, FUTURE } from '../../config/regions';
import { easeInOutQuart } from '../../helpers/easing.helpers';


class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = this.calculateVertexAndEdgePositions(props)

    this.animate = ::this.animate;
  }

  componentDidMount() {
    this.resizeHandler = window.addEventListener('resize', () => {
      this.setState(this.calculateVertexAndEdgePositions());
    });
  }

  calculateResponsiveRadiusAndRegions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const radiusPercentageRatio = 0.1;

    const radius = min([width, height]) * radiusPercentageRatio;

    // TODO: A mobile mode where the nodes stack in rows instead of columns.
    return {
      radius,
      regionCoords: {
        [GRAVEYARD]:  width * -1/4 - radius,
        [PAST]:       width * 1/6 - radius,
        [PRESENT]:    width * 3/6 - radius,
        [FUTURE]:     width * 5/6 - radius
      },
      regionIndexCoords: [
        height * 3/12 - radius,
        height * 6/12 - radius,
        height * 9/12 - radius
      ]
    }
  }

  updateEdgesFromVertices(vertices, edges) {
    // All vertices have the same radius. Just pick it from the first
    const radius = vertices.getIn([0, 'r']);

    return edges.map( e => {
      const from  = vertices.find( v => v.get('id') === e.get('from'));
      const to    = vertices.find( v => v.get('id') === e.get('to'));

      return e
        .set( 'x1', from.get('x') + radius )
        .set( 'y1', from.get('y') + radius )
        .set( 'x2', to.get('x') + radius )
        .set( 'y2', to.get('y') + radius );
    });
  }

  calculateVertexAndEdgePositions(props = this.props) {
    const {
      radius,
      regionCoords,
      regionIndexCoords
    } = this.calculateResponsiveRadiusAndRegions();

    const vertices = props.vertices.map( v => v
      .set( 'x', regionCoords[v.get('region')] )
      .set( 'y', regionIndexCoords[v.get('regionIndex')] )
      .set( 'r', radius )
    );

    const edges = this.updateEdgesFromVertices(vertices, props.edges);

    return { vertices, edges };
  }

  animate(nextProps) {
    // TODO: Move this to a config file
    const duration = 1000;
    const easingFunction = easeInOutQuart;

    const startTime = new Date().getTime();

    const updatePosition = () => {
      requestAnimationFrame( () => {
        const time = new Date().getTime() - startTime;

        // TODO: Start by doing the retractions, for disappeared nodes.

        // Figure out the new center points for our vertices
        const newVertices = this.state.vertices.map( (vertex, vertexIndex) => {
          // TODO: Replace these with .find calls, since we won't be guaranteed
          // that the index is the same.
          const originVertex  = this.state.vertices.get(vertexIndex);
          const finalVertex   = nextProps.vertices.get(vertexIndex);

          return vertex
            .set('x', easingFunction(
              time,
              originVertex.get('x'),
              finalVertex.get('x') - originVertex.get('x'),
              duration
            ))
            .set('y', easingFunction(
              time,
              originVertex.get('y'),
              finalVertex.get('y') - originVertex.get('y'),
              duration
            ));
        });

        const newEdges = this.updateEdgesFromVertices(newVertices, this.state.edges);

        this.setState({
          vertices: newVertices,
          edges:    newEdges
        }, () => {
          if ( time < duration ) updatePosition();
        });
      });
    }

    updatePosition();

  }

  moveTo(ev) {
    this.animate({
      vertices: this.state.vertices.map( v => v.update('x', x => Math.random() * 1000))
    })
  }

  render() {
    const { vertices, edges, actions } = this.props;

    return (
      <svg id="graph" onClick={(ev) => this.moveTo(ev)}>
        {
          this.state.edges.map( (e, i) => {
            return (
              <line
                key={i}
                x1={e.get('x1')}
                y1={e.get('y1')}
                x2={e.get('x2')}
                y2={e.get('y2')}
              />
            )
          })
        }

        <defs>
          <filter id="dropshadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {
          this.state.vertices.map( (v, i) => {
            return (
              <svg
                key={i}
                width={v.get('r') * 2}
                height={v.get('r') * 2}
                x={v.get('x')}
                y={v.get('y')}
                filter="url(#dropshadow)"
              >

                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="#FFFFFF"

                />
                <text
                  x="50%"
                  y="50%"
                  text-anchor="middle"
                  style={{ fontSize: '14px', fontWeight: 'bold'}}
                >
                  {v.get('name')}
                </text>
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

}



export default Graph;
