import React, { Component, PropTypes } from 'react';
import { List, Map, fromJS } from 'immutable';
import min from 'lodash/min';

import { CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE } from '../../config/regions';
import {
  repositionDelay, repositionLength, vertexEnterLength
} from '../../config/timing';
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
    this.animateReorder = this.animateReorder.bind(this);
    this.dispatchMarkVertexAsSelected = this.dispatchMarkVertexAsSelected.bind(this);
    this.animateRelatedArtists = this.animateRelatedArtists.bind(this);
    this.dispatchUpdateRepositionStatus = this.dispatchUpdateRepositionStatus.bind(this);
  }

  componentDidMount() {
    this.resizeHandler = () => {
      this.setState(this.calculateVertexAndEdgePositions());
    }

    window.addEventListener('resize', this.resizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  componentWillReceiveProps(nextProps) {
    // Calculate positions of the new vertices
    nextProps = this.calculateVertexAndEdgePositions(nextProps);

    // The very first render is a special case; we don't have any rejections,
    // reorderings or related artists, we just need to draw the node and mark
    // the vertex as selected.
    if ( !this.state.vertices.size ) {
      this.setState({
        vertices: nextProps.vertices,
        edges: nextProps.edges
      }, () => {
        setTimeout(() => {
          this.props.actions.markVertexAsSelected(this.state.vertices.get(0));
        }, vertexEnterLength * 0.5)
      })
    } else {
      this.animateRejection(nextProps)
        .then(this.animateReorder)
        .then(this.dispatchMarkVertexAsSelected)
        .then(this.animateRelatedArtists)
        .then(this.dispatchUpdateRepositionStatus);
    }
  }

  animateRejection(nextProps) {
    return new Promise( (resolve, reject) => {
      const { vertices, edges } = this.state;

      // Find all the vertices that do not exist in nextProps
      const rejectedVertices = filterVerticesNotInSecondGroup(vertices, nextProps.vertices);

      if ( rejectedVertices.size === 0 ) { return resolve(nextProps); }

      // For rejections, we just assign properties to vertices/edges.
      // The components handle their own transitions.
      const nextVertices = markRejectedVertices(vertices, rejectedVertices);
      const nextEdges    = markRetractingEdges(edges, rejectedVertices);

      this.setState({
        vertices: nextVertices,
        edges: nextEdges
      }, () => {
        setTimeout(resolve.bind(this, nextProps), repositionDelay);
      });

    });
  }

  animateReorder(nextProps) {
    return new Promise( (resolve, reject) => {
      const { vertices, edges } = this.state;

      const animationNeeded = verticesHaveChangedPositions(vertices, nextProps.vertices);

      if ( !animationNeeded ) return resolve(nextProps);

      const duration = 1000;
      const easingFunction = easeInOutCubic;
      const startTime = new Date().getTime();

      const originVertices = this.state.vertices.slice();


      const updatePosition = () => {
        requestAnimationFrame( () => {
          const time = new Date().getTime() - startTime;

          if ( time > duration ) return resolve(nextProps);

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

          const nextEdges = this
            .updateEdgesFromVertices(nextVertices, recalculateEdges(nextVertices))
            .map( nextEdge => {
              const previousEdge = edges.find( edge =>
                edge.get('to') === nextEdge.get('to') &&
                edge.get('from') === nextEdge.get('from')
              );

              return previousEdge ? previousEdge.merge(nextEdge) : nextEdge;
            });



          this.setState({
            vertices: nextVertices,
            edges:    nextEdges
          }, updatePosition);
        });
      }

      updatePosition();
    });
  }

  dispatchMarkVertexAsSelected(nextProps) {
    return new Promise( (resolve, reject) => {
      // Note: This is not actually an async action, I'm just promisifying it
      // because it's between a chain of async actions.
      const newSelectedVertex = nextProps.vertices.find( vertex => (
        vertex.get('region') === PRESENT
      ));

      if ( !newSelectedVertex ) {
        return reject("No vertex found in the PRESENT region");
      }

      this.props.actions.markVertexAsSelected(newSelectedVertex);

      resolve(nextProps);
    });
  }

  animateRelatedArtists(nextProps) {
    return new Promise( (resolve, reject) => {
      const { vertices } = this.state;
      // No changes necessary for vertices
      const nextVertices = nextProps.vertices;

      // If we don't have any FUTURE nodes, we can skip this bit.
      const futureVertices = getVerticesInRegion(nextVertices, FUTURE);

      if ( futureVertices.size === 0 ) {
        return resolve(nextProps);
      }

      // Set all edges that point to future vertices as 'expanding'
      const nextEdges = markExpandingEdges(nextProps.edges, futureVertices);

      this.setState({
        vertices: nextVertices,
        edges:    nextEdges
      }, () => resolve(nextProps));
    });
  }

  dispatchUpdateRepositionStatus(nextProps) {
    return this.props.actions.updateRepositionStatus(false);
  }

  calculateResponsiveRadiusAndRegions() {
    const width   = window.innerWidth;
    const height  = window.innerHeight;
    const mode    = ( width <= 750 && width < height ) ? 'mobile' : 'desktop';
    const radius  = mode === 'mobile' ? width * 0.18 : height * 0.1;

    let coords = { }

    if ( mode === 'mobile' ) {
      coords = {
        [CATACOMBS]: {
          x: width * 1/2 - radius,
          y: height * -1/4 - radius
        },
        [GRAVEYARD]: {
          x: width * 1/2 - radius,
          y: height * -1/4 - radius
        },
        [PAST]: {
          x: width * 1/2 - radius,
          y: height * -1/4 - radius
        },
        [PRESENT]: {
          x: width * 1/2 - radius,
          y: height * 1/4 - radius
        },
        [FUTURE]: {
          x: [
            width * 1/6 - radius,
            width * 3/6 - radius,
            width * 5/6 - radius
          ],
          y: [
            // TODO: slight offsets
            height * 3/4 + height * -1/20 - radius,
            height * 3/4 + height *  1/20 - radius,
            height * 3/4 + height * -1/20 - radius
          ]
        }
      };
    } else {
      coords = {
        [CATACOMBS]: {
          x: width * -1/4 - radius,
          y: height * 1/2 - radius
        },
        [GRAVEYARD]: {
          x: width * -1/4 - radius,
          y: height * 1/2 - radius
        },
        [PAST]: {
          x: width *  1/6 - radius,
          y: height * 1/2 - radius
        },
        [PRESENT]: {
          x: width *  3/6 - radius,
          y: height * 1/2 - radius
        },
        [FUTURE]: {
          x: [
            width * 5/6 + width * -1/40 - radius,
            width * 5/6 + width *  1/40 - radius,
            width * 5/6 + width * -1/40 - radius
          ],
          y: [
            height * 3/12 - radius,
            height * 6/12 - radius,
            height * 9/12 - radius
          ]
        }
      };
    }

    return { radius, coords };
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

  calculateVertexAndEdgePositions(props = this.state) {
    const { radius, coords } = this.calculateResponsiveRadiusAndRegions();

    const vertices = props.vertices.map( v => {
      let x = coords[v.get('region')]['x'];
      let y = coords[v.get('region')]['y'];

      // The 'FUTURE' region can vary depending on the item's index. The first
      // FUTURE vertex might have a different position than the second.
      // To deal with this, the coordinates can either hold an integer, when
      // all values are the same, or an array of integers when it varies. We
      // can look up the appropriate value with our regionIndex.
      if ( typeof x === 'object' ) x = x[v.get('regionIndex')];
      if ( typeof y === 'object' ) y = y[v.get('regionIndex')];

      return v
        .set( 'x', x )
        .set( 'y', y )
        .set( 'radius', radius );
    });

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
