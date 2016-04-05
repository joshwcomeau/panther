import { expect }               from 'chai';
import { List, Map, fromJS }    from 'immutable';
import * as _                   from 'lodash';

import { CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE } from '../../client/config/regions';

import { selectActionCreators } from '../../client/helpers/duck.helpers';
import reducer                  from '../../client/ducks/graph.duck';
import * as duckStuff           from '../../client/ducks/graph.duck';


const Actions = selectActionCreators(duckStuff);
const {
  SELECT_ARTIST,
  SETUP_INITIAL_STAGE,
  UPDATE_REPOSITION_STATUS,
  UPDATE_LOADING_STATUS,
  ADD_RELATED_ARTISTS_TO_GRAPH,
  CENTER_GRAPH_AROUND_VERTEX
} = duckStuff;

const regions = [ CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE ];


describe('Graph duck', () => {
  it(SETUP_INITIAL_STAGE, () => {
    const artistId = '123';
    const state = undefined;
    const action = Actions.setupInitialStage( fromJS({ id: artistId }) );

    const expectedState = fromJS({
      vertices: [{ id: artistId, region: PRESENT, regionIndex: 1 }],
      edges: List(),
      selected: null,
      repositioning: false
    });
    const actualState = reducer(state, action);

    expect(actualState).to.equal(expectedState);
  });


  it(UPDATE_REPOSITION_STATUS, () => {
    const state = { vertices: [], repositioning: true };
    const action = Actions.updateRepositionStatus(false);

    const expectedState = fromJS({
      ...state, repositioning: false
    });
    const actualState = reducer(fromJS(state), action);

    expect(actualState).to.equal(expectedState);
  });


  it(UPDATE_LOADING_STATUS, () => {
    const state = { vertices: [], loading: false };
    const action = Actions.updateLoadingStatus(true);

    const expectedState = fromJS({
      ...state, loading: true
    });
    const actualState = reducer(fromJS(state), action);

    expect(actualState).to.equal(expectedState);
  });


  describe(CENTER_GRAPH_AROUND_VERTEX, () => {
    it('updates correctly without PAST (1st transition)', () => {
      const state = generateInitialGraph({ present: true, future: 3})
      const action = Actions.centerGraphAroundVertex( fromJS({ id: 'fut2' }) );

      const expectedState = fromJS({
        vertices: [
          { id: 'pres', region: PAST, regionIndex: 1 },
          { id: 'fut2', region: PRESENT, regionIndex: 1 }
        ],
        edges: [
          { from: 'pres', to: 'fut2' }
        ],
        repositioning: true
      });
      const actualState = reducer(state, action);

      expect(actualState).to.equal(expectedState);
    });

    it('updates correctly without GRAVEYARD (2nd transition)', () => {
      const state = generateInitialGraph({ past: true, present: true, future: 3})
      const action = Actions.centerGraphAroundVertex( fromJS({ id: 'fut1' }) );

      const expectedState = fromJS({
        vertices: [
          { id: 'past', region: GRAVEYARD, regionIndex: 1 },
          { id: 'pres', region: PAST, regionIndex: 1 },
          { id: 'fut1', region: PRESENT, regionIndex: 1 }
        ],
        edges: [
          { from: 'past', to: 'pres' },
          { from: 'pres', to: 'fut1' }
        ],
        repositioning: true
      });
      const actualState = reducer(state, action);

      expect(actualState).to.equal(expectedState);
    });

    it('updates correctly without CATACOMBS (3rd transition)', () => {
      const state = generateInitialGraph({
        graveyard: true,
        past: true,
        present: true,
        future: 3
      })
      const action = Actions.centerGraphAroundVertex( fromJS({ id: 'fut1' }) );

      const expectedState = fromJS({
        vertices: [
          { id: 'grav', region: CATACOMBS, regionIndex: 1 },
          { id: 'past', region: GRAVEYARD, regionIndex: 1 },
          { id: 'pres', region: PAST, regionIndex: 1 },
          { id: 'fut1', region: PRESENT, regionIndex: 1 }
        ],
        edges: [
          { from: 'grav', to: 'past' },
          { from: 'past', to: 'pres' },
          { from: 'pres', to: 'fut1' }
        ],
        repositioning: true
      });
      const actualState = reducer(state, action);

      expect(actualState).to.equal(expectedState);
    });

    it('updates correctly with all components (4th+ transition)', () => {
      const state = generateInitialGraph({
        catacombs: true,
        graveyard: true,
        past: true,
        present: true,
        future: 3
      });
      const action = Actions.centerGraphAroundVertex( fromJS({ id: 'fut0' }) );

      const expectedState = fromJS({
        vertices: [
          { id: 'grav', region: CATACOMBS, regionIndex: 1 },
          { id: 'past', region: GRAVEYARD, regionIndex: 1 },
          { id: 'pres', region: PAST, regionIndex: 1 },
          { id: 'fut0', region: PRESENT, regionIndex: 1 }
        ],
        edges: [
          { from: 'grav', to: 'past' },
          { from: 'past', to: 'pres' },
          { from: 'pres', to: 'fut0' }
        ],
        repositioning: true
      });
      const actualState = reducer(state, action);

      expect(actualState).to.equal(expectedState);
    });



  });
});

function generateInitialGraph({ catacombs, graveyard, past, present, future=0 }) {
  let vertices = [];
  let edges = [];

  if ( catacombs ) {
    vertices.push({ id: 'cata', region: CATACOMBS, regionIndex: 1 });
  }
  if ( graveyard ) {
    vertices.push({ id: 'grav', region: GRAVEYARD, regionIndex: 1 });
  }
  if ( past ) {
    vertices.push({ id: 'past', region: PAST, regionIndex: 1 });
  }
  if ( present ) {
    vertices.push({ id: 'pres', region: PRESENT, regionIndex: 1 });
  }

  _.range(future).forEach( (futureVertex, i) => {
    vertices.push({ id: 'fut'+i, region: FUTURE, regionIndex: i });
  });

  // Calculate edges by taking vertices two at a time
  vertices.forEach( (vertex, i) => {
    const regionIndex = regions.indexOf(vertex.region)
    const nextRegion = regions[regionIndex+1];

    if ( !nextRegion ) return;

    const nextVertices = vertices.filter( ({region}) => region === nextRegion );

    nextVertices.forEach( nextVertex => {
      edges.push({ from: vertex.id, to: nextVertex.id });
    });
  });

  return fromJS({ vertices, edges });
}
