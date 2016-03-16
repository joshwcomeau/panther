import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import min from 'lodash/min'

import { CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE } from '../../config/regions';
import { repositionDelay, repositionLength } from '../../config/timing';
import { easeInOutCubic } from '../../helpers/easing.helpers';
import {
  filterVerticesNotInSecondGroup,
  findMatchingVertex,
  markRejectedVertices,
  markRetractingEdges,
  markExpandingEdges,
  recalculateEdges,
  getVerticesInRegion,
  verticesHaveChangedPositions
} from '../../helpers/graph.helpers';


import VertexContainer from '../../containers/VertexContainer.jsx';
import Edge from './Edge.jsx';


class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = this.calculateVertexAndEdgePositions(props);
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
    // Calculate positions of the new vertices
    nextProps = this.calculateVertexAndEdgePositions(nextProps);

    this.animateRejection(nextProps)
      .then(this.animateReorder.bind(this, nextProps))
      .then(this.animateRelatedArtists.bind(this, nextProps));
  }

  animateRejection(nextProps) {
    return new Promise( (resolve, reject) => {
      const { vertices, edges } = this.state;

      // Find all the vertices that do not exist in nextProps
      const rejectedVertices = filterVerticesNotInSecondGroup(vertices, nextProps.vertices);

      if ( rejectedVertices.size === 0 ) { return resolve(); }

      // For rejections, we just assign properties to vertices/edges.
      // The components handle their own transitions.
      const nextVertices = markRejectedVertices(vertices, rejectedVertices);
      const nextEdges    = markRetractingEdges(edges, rejectedVertices);

      this.setState({
        vertices: nextVertices,
        edges: nextEdges
      }, () => {
        setTimeout(resolve, repositionDelay);
      });

    });
  }

  animateReorder(nextProps) {
    return new Promise( (resolve, reject) => {
      const { vertices, edges } = this.state;

      const animationNeeded = verticesHaveChangedPositions(vertices, nextProps.vertices);

      if ( !animationNeeded ) return resolve();

      const duration = 1000;
      const easingFunction = easeInOutCubic;
      const startTime = new Date().getTime();

      const originVertices = this.state.vertices.slice();


      const updatePosition = () => {
        requestAnimationFrame( () => {
          const time = new Date().getTime() - startTime;

          if ( time > duration ) return resolve();

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
    });
  }

  animateRelatedArtists(nextProps) {
    return new Promise( (resolve, reject) => {
      const { vertices } = this.state;
      // No changes necessary for vertices
      const nextVertices = nextProps.vertices;

      // If we don't have any FUTURE nodes, we can skip this bit.
      if ( getVerticesInRegion(nextVertices, FUTURE).size === 0 ) {
        return resolve();
      }

      // Find all new vertices (don't exist in this.state.vertices)
      const newVertices = filterVerticesNotInSecondGroup(nextVertices, vertices);

      // Set all edges that point to new vertices as 'expanding'
      const nextEdges = markExpandingEdges(nextProps.edges, newVertices);

      this.setState({
        vertices: nextVertices,
        edges:    nextEdges
      }, resolve);
    });
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
