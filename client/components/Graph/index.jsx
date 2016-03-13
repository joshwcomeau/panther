import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import min from 'lodash/min'

import { GRAVEYARD, PAST, PRESENT, FUTURE } from '../../config/regions';
import { easeInOutCubic } from '../../helpers/easing.helpers';
import { recalculateEdges } from '../../helpers/graph.helpers';

import VertexContainer from '../../containers/VertexContainer.jsx';
import Edge from './Edge.jsx';


class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = this.calculateVertexAndEdgePositions(props)
  }

  componentDidMount() {
    this.resizeHandler = window.addEventListener('resize', () => {
      this.setState(this.calculateVertexAndEdgePositions());
    });
  }

  componentWillReceiveProps(nextProps) {
    // Don't animate on the first invocation.
    this.animate(nextProps)
  }

  animate(nextProps) {
    // TODO: Move this to a config file
    const duration = 1000;
    const easingFunction = easeInOutCubic;

    const startTime = new Date().getTime();

    // // Only animate vertices that have _moved_.
    // // For now, ignore new vertices and destroyed vertices.
    // const this.state.vertices = this.state.vertices.filter( vertex => {
    //   return nextProps.vertices.find( nextVertex => {
    //     return nextVertex.get('id') === vertex.get('id');
    //   });
    // });
    //
    // Calculate X/Y coordinates for nextVertices
    nextProps = this.calculateVertexAndEdgePositions(nextProps)

    const {
      radius, regionCoords, regionIndexCoords
    } = this.calculateResponsiveRadiusAndRegions()

    const originVertices = this.state.vertices.slice();


    const updatePosition = () => {
      requestAnimationFrame( () => {
        const time = new Date().getTime() - startTime;

        if ( time > duration ) return;

        // TODO: retract disappeared nodes first

        // Figure out the new center points for our vertices
        const newVertices = nextProps.vertices.map( vertex => {
          const finalVertex   = nextProps.vertices.find( v => v.get('id') === vertex.get('id'));

          const originVertex  = originVertices.find( v => v.get('id') === vertex.get('id')) || finalVertex;

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

        const newEdges = this.updateEdgesFromVertices(newVertices, recalculateEdges(newVertices));

        this.setState({
          vertices: newVertices,
          edges:    newEdges
        }, updatePosition);
      });
    }

    updatePosition();
  }

  calculateResponsiveRadiusAndRegions() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const radius = min([width, height]) * 1/10;

    // TODO: A mobile mode where the nodes stack in rows instead of columns.
    return {
      radius,
      regionCoords: {
        [GRAVEYARD]:  width * -1/4 - radius,
        [PAST]:       width *  1/6 - radius,
        [PRESENT]:    width *  3/6 - radius,
        [FUTURE]:     width *  5/6 - radius
      },
      regionIndexCoords: [
        height * 3/12 - radius,
        height * 6/12 - radius,
        height * 9/12 - radius
      ],
      regionOffset: {
        [GRAVEYARD]:  [0,0,0],
        [PAST]:       [0,0,0],
        [PRESENT]:    [0,0,0],
        [FUTURE]:     [
          width * -1/40,
          width * 1/40,
          width * -1/40
        ]
      }
    };
  }

  updateEdgesFromVertices(vertices, edges) {
    // All vertices have the same radius. Just pick it from the first
    const radius = vertices.getIn([0, 'radius']);

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
      regionIndexCoords,
      regionOffset
    } = this.calculateResponsiveRadiusAndRegions();

    const vertices = props.vertices.map( v => v
      .set( 'x',  regionCoords[v.get('region')]
                + regionOffset[v.get('region')][v.get('regionIndex')])
      .set( 'y', regionIndexCoords[v.get('regionIndex')] )
      .set( 'radius', radius )
    );

    const edges = this.updateEdgesFromVertices(vertices, props.edges);

    return { vertices, edges };
  }



  render() {
    return (
      <svg id="graph">
        { this.state.edges.map( (e, i) => <Edge key={i} data={e} /> ) }
        { this.state.vertices.map( v => (
          <VertexContainer
            key={v.get('id')}
            id={v.get('id')}
            x={v.get('x')}
            y={v.get('y')}
            radius={v.get('radius')}
            region={v.get('region')}
          />
        ))}
      </svg>
    );
  }
};

export default Graph;
