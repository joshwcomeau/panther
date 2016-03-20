import { expect }               from 'chai';
import { List, Map, fromJS }    from 'immutable';
import * as _                   from 'lodash';

import { GRAVEYARD, PAST, PRESENT, FUTURE } from '../../client/config/regions';

import { selectActionCreators } from '../../client/helpers/duck.helpers';
import reducer                  from '../../client/ducks/graph.duck';
import * as duckStuff           from '../../client/ducks/graph.duck';

const Actions = selectActionCreators(duckStuff);
const {
  SELECT_ARTIST,
  SETUP_INITIAL_STAGE,
  UPDATE_REPOSITION_STATUS,
  ADD_RELATED_ARTISTS_TO_GRAPH,
  CENTER_GRAPH_AROUND_VERTEX
} = duckStuff;


describe('Graph duck', () => {
  describe('Reducer', () => {
    describe(CENTER_GRAPH_AROUND_VERTEX, () => {
      it('updates correctly without PAST or GRAVEYARD', () => {
        const state = fromJS({
          vertices: [
            { id: 'a', region: PRESENT, regionIndex: 1 },
            { id: 'b', region: FUTURE, regionIndex: 0 },
            { id: 'c', region: FUTURE, regionIndex: 1 },
            { id: 'd', region: FUTURE, regionIndex: 2 },
          ], edges: [
            { from: 'a', to: 'b' },
            { from: 'a', to: 'c' },
            { from: 'a', to: 'd' }
          ]
        });
        const action = {
          type: CENTER_GRAPH_AROUND_VERTEX,
          artist: fromJS({ id: 'd' })
        };

        const expectedState = fromJS({
          vertices: [
            { id: 'a', region: PAST, regionIndex: 1 },
            { id: 'd', region: PRESENT, regionIndex: 1 }
          ],
          edges: [
            { from: 'a', to: 'd' }
          ],
          status: 'repositioning'
        });
        const actualState = reducer(state, action);

        expect(actualState).to.equal(expectedState);
      });
    });
  });
});
