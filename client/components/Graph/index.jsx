import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import min from 'lodash/min'

import { easeInOutCubic } from '../../helpers/easing.helpers';
import { recalculateEdges } from '../../helpers/graph.helpers';
import { CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE } from '../../config/regions';
import { repositionDelay, repositionLength } from '../../config/timing';


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
    this.animate(nextProps)
  }

  animate(nextProps) {
    this.animateRejection(nextProps, () => {
      this.animateReorder(nextProps, () => {
        this.animateRelatedArtists(nextProps)
      })
    })
  }

  animateRelatedArtists(nextProps) {
    // Calculate positions of the new vertices
    nextProps = this.calculateVertexAndEdgePositions(nextProps);

    // No changes necessary for vertices
    const nextVertices = nextProps.vertices;

    // Get the IDs of all new vertices
    const newVertices = nextVertices.filter( nextVertex => {
      return !this.state.vertices.find( vertex => (
        vertex.get('id') === nextVertex.get('id')
      ));
    });

    // Set all edges that point to new vertices as 'expanding'
    const nextEdges = nextProps.edges.map( edge => {
      const pointsToNewVertex = newVertices.find( vertex => (
        vertex.get('id') === edge.get('to')
      ))

      if ( pointsToNewVertex ) {
        edge = edge.set('expanding', true);
      }
      return edge;
    });

    this.setState({
      vertices: nextVertices,
      edges:    nextEdges
    });
  }

  animateRejection(nextProps, callback) {
    const rejectedVertices = this.state.vertices.filter( vertex => (
      !nextProps.vertices.find( nextVertex => (
        vertex.get('id') === nextVertex.get('id')
      ))
    ));

    if ( rejectedVertices.size === 0 ) {
      return callback();
    }

    // Rather than do this animation in JS, I can use SVG line animation
    // and CSS keyframe animations. Just mark the vertices and edges, so
    // it can be dealt with in their components.
    const nextVertices = this.state.vertices.map( vertex => {
      const isRejected = rejectedVertices.find( rejectedVertex => (
        vertex.get('id') === rejectedVertex.get('id')
      ));

      if ( isRejected ) vertex = vertex.set('rejected', true);
      return vertex;
    });

    const nextEdges = this.state.edges.map( edge => {
      const pointsToRejectedVertex = rejectedVertices.find( vertex => (
        vertex.get('id') === edge.get('to')
      ));

      if ( pointsToRejectedVertex ) {
        edge = edge.set('retracting', true);
      }
      return edge;
    });

    this.setState({
      vertices: nextVertices,
      edges: nextEdges
    }, () => {
      setTimeout(callback.bind(this), repositionDelay);
    });
  }

  animateReorder(nextProps, callback) {
    const hasRepositionedVertices = this.state.vertices.some( vertex => {
      const nextVertex = nextProps.vertices.find( nextVertex => (
        nextVertex.get('id') === vertex.get('id')
      ));

      return nextVertex && vertex.get('region') !== nextVertex.get('region');
    });

    if ( !hasRepositionedVertices ) return callback();

    const duration = 1000;
    const easingFunction = easeInOutCubic;

    const startTime = new Date().getTime();

    // Calculate X/Y coordinates for nextVertices
    nextProps = this.calculateVertexAndEdgePositions(nextProps);

    const {
      radius, regionCoords, regionIndexCoords
    } = this.calculateResponsiveRadiusAndRegions()

    const originVertices = this.state.vertices.slice();


    const updatePosition = () => {
      requestAnimationFrame( () => {
        const time = new Date().getTime() - startTime;

        if ( time > duration ) return callback();

        // Figure out the new center points for our vertices
        const nextVertices = nextProps.vertices.map( vertex => {
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

        const nextEdges = this.updateEdgesFromVertices(nextVertices, recalculateEdges(nextVertices));

        this.setState({
          vertices: nextVertices,
          edges:    nextEdges
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
        [CATACOMBS]:  width * -1/4 - radius,
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
        [CATACOMBS]:  [0,0,0],
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
        { this.state.edges.map( (e, i) => (
          <Edge
            key={i}
            x1={e.get('x1')}
            y1={e.get('y1')}
            x2={e.get('x2')}
            y2={e.get('y2')}
            retracting={e.get('retracting')}
            expanding={e.get('expanding')}
          />
        ))}
        { this.state.vertices.map( v => (
          <VertexContainer
            key={v.get('id')}
            id={v.get('id')}
            x={v.get('x')}
            y={v.get('y')}
            radius={v.get('radius')}
            region={v.get('region')}
            rejected={v.get('rejected')}
          />
        ))}
      </svg>
    );
  }
};

export default Graph;
