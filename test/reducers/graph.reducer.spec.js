import { expect }               from 'chai';
import { List, Map, fromJS }    from 'immutable';
import * as _                   from 'lodash';

import { CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE } from '../../client/config/regions';

import { selectActionCreators } from '../../client/helpers/duck.helpers';
import reducer                  from '../../client/ducks/graph.duck';
import * as duckStuff           from '../../client/ducks/graph.duck';


const Actions = selectActionCreators(duckStuff);
const {
  SETUP_INITIAL_STAGE,
  UPDATE_REPOSITION_STATUS,
  UPDATE_LOADING_STATUS,
  ADD_RELATED_ARTISTS_TO_GRAPH,
  MARK_VERTEX_AS_SELECTED,
  CENTER_GRAPH_AROUND_VERTEX,
  CAPTURE_GRAPH_STATE,
  RESTORE_GRAPH_STATE,
  EMPTY_GRAPH
} = duckStuff;

const regions = [ CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE ];


describe('Graph duck', () => {
  it(SETUP_INITIAL_STAGE, () => {
    const artist = fromJS({ id: '1337' });
    const state  = reducer();
    const action = Actions.setupInitialStage(artist);

    const expectedState = fromJS({
      vertices: [{ id: artist.get('id'), region: PRESENT, regionIndex: 1 }],
      edges: List(),
      selected: null,
      repositioning: false
    });
    const actualState = reducer(state, action);

    expect(actualState).to.equal(expectedState);
  });


  it(UPDATE_REPOSITION_STATUS, () => {
    const state  = reducer();
    const action = Actions.updateRepositionStatus(false);

    const expectedState = state.merge({ repositioning: false });
    const actualState = reducer(fromJS(state), action);

    expect(actualState).to.equal(expectedState);
  });


  it(UPDATE_LOADING_STATUS, () => {
    const state   = reducer();
    const action  = Actions.updateLoadingStatus(true);

    const expectedState = state.merge({ loading: true });
    const actualState = reducer(fromJS(state), action);

    expect(actualState).to.equal(expectedState);
  });


  it(ADD_RELATED_ARTISTS_TO_GRAPH, () => {
    const newArtists = [
      { id: '123', name: 'Billy Bob' },
      { id: '456', name: 'James Holden' },
      { id: '789', name: 'Shania Twain' }
    ];

    const state  = generateInitialGraph({ past: true, present: true });
    const action = Actions.addRelatedArtistsToGraph(newArtists);

    const expectedState = fromJS({
      vertices: [
        { id: 'past', region: PAST,     regionIndex: 1 },
        { id: 'pres', region: PRESENT,  regionIndex: 1 },
        { id: '123',  region: FUTURE,   regionIndex: 0 },
        { id: '456',  region: FUTURE,   regionIndex: 1 },
        { id: '789',  region: FUTURE,   regionIndex: 2 }
      ],
      edges: [
        { from: 'past', to: 'pres' },
        { from: 'pres', to: '123' },
        { from: 'pres', to: '456' },
        { from: 'pres', to: '789' }
      ]
    });
    const actualState = reducer(state, action);

    expect(actualState).to.equal(expectedState);
  });


  describe(CENTER_GRAPH_AROUND_VERTEX, () => {
    it('updates correctly without PAST (1st transition)', () => {
      const state  = generateInitialGraph({ present: true, future: 3})
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
      const state  = generateInitialGraph({ past: true, present: true, future: 3})
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


  it(MARK_VERTEX_AS_SELECTED, () => {
    const artist  = fromJS({ id: 'abcd' });
    const state   = reducer();
    const action  = Actions.markVertexAsSelected(artist);

    const expectedState = state.merge({ selected: artist.get('id') });
    const actualState   = reducer(state, action);

    expect(actualState).to.equal(expectedState);
  });


  it(CAPTURE_GRAPH_STATE, () => {
    const state   = reducer().merge({ history: 'A long time ago...' });
    const action  = Actions.captureGraphState();

    const expectedState = state.merge({ history: state });
    const actualState   = reducer(state, action);

    expect(actualState).to.equal(expectedState);
  });

  describe(RESTORE_GRAPH_STATE, () => {
    it('sets the previous state to the current state', () => {
      const firstState = reducer().merge({ vertices: [
        { id: '123', name: 'Billy Bob' }
      ]});
      const state   = reducer().merge({ history: firstState });
      const action  = Actions.restoreGraphState();

      const expectedState = firstState;
      const actualState   = reducer(state, action);

      expect(actualState).to.equal(expectedState);
    });

    it('allows the process to be repeated several times', () => {
      const firstState = reducer().merge({
        vertices: [
          { id: '123', name: 'Alice Apple' },
          { id: '456', name: 'Billy Bob' },
          { id: '789', name: 'Candy Corn' }
        ]
      });
      const secondState = reducer().merge({
        vertices: [
          { id: '123', name: 'Alice Apple' },
          { id: '456', name: 'Billy Bob' }
        ],
        history: firstState
      });
      const thirdState = reducer().merge({
        vertices: [ { id: '123', name: 'Alice Apple' } ],
        history: secondState
      });
      const fourthState = reducer().merge({ history: thirdState });

      const action  = Actions.restoreGraphState();

      const expectedStateAfter1stRestore = thirdState;
      const actualStateAfter1stRestore   = reducer(fourthState, action);
      expect(actualStateAfter1stRestore).to.equal(expectedStateAfter1stRestore);

      const expectedStateAfter2ndRestore = secondState;
      const actualStateAfter2ndRestore   = reducer(thirdState, action);
      expect(actualStateAfter2ndRestore).to.equal(expectedStateAfter2ndRestore);

      const expectedStateAfter3rdRestore = firstState;
      const actualStateAfter3rdRestore   = reducer(secondState, action);
      expect(actualStateAfter3rdRestore).to.equal(expectedStateAfter3rdRestore);
    });

    it('preserves the current selection', () => {
      // For reasons explained in graph.duck under the RESTORE_GRAPH_STATE case,
      // we don't want to restore the `selected` prop.
      const firstState = reducer().merge({
        vertices: [
          { id: '123', name: 'Alice Apple' }
        ],
        selected: '123'
      });
      const state   = reducer().merge({
        vertices: [
          { id: '123', name: 'Alice Apple' },
          { id: '456', name: 'Billy Bob' }
        ],
        selected: '456',
        history: firstState
      });
      const action  = Actions.restoreGraphState();

      const expectedState = firstState.set('selected', '456');
      const actualState   = reducer(state, action);

      expect(actualState).to.equal(expectedState);
    });
  });

  it(EMPTY_GRAPH, () => {
    const state   = reducer().merge({ vertices: [ { id: '123' }] });
    const action  = Actions.emptyGraph();

    const expectedState = reducer();
    const actualState   = reducer(state, action);

    expect(actualState).to.equal(expectedState);
  })
});



///////////////////////////
// HELPERS ///////////////
/////////////////////////

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
