import { expect }               from 'chai';
import { List, Map, fromJS }    from 'immutable';
import * as _                   from 'lodash';

import { selectActionCreators } from '../../client/helpers/duck.helpers';
import reducer                  from '../../client/ducks/artist-info.duck';
import * as duckStuff           from '../../client/ducks/artist-info.duck';

const Actions = selectActionCreators(duckStuff);
const { TOGGLE_ARTIST } = duckStuff;


describe('artistInfo duck', () => {
  describe('Action creators', () => {
    it('returns a `toggleArtist` action', () => {
      const input = false;

      const expectedOutput = { type: TOGGLE_ARTIST, newState: input };
      const actualOutput   = Actions.toggleArtist(input);

      expect(expectedOutput).to.deep.equal(actualOutput);
    });
  });

  describe('Reducer', () => {
    describe(TOGGLE_ARTIST, () => {
      it('sets `artistVisible` to the `false` input', () => {
        const action = Actions.toggleArtist(false);
        const state  = fromJS({ artistVisible: true });

        const expectedState = fromJS({ artistVisible: false });
        const actualState = reducer(state, action);

        expect(expectedState).to.equal(actualState);
      });

      it('sets `artistVisible` to the `true` input', () => {
        const action = Actions.toggleArtist(true);
        const state  = fromJS({ artistVisible: false });

        const expectedState = fromJS({ artistVisible: true });
        const actualState = reducer(state, action);

        expect(expectedState).to.equal(actualState);
      });

      it('toggles `artistVisible` when no input is provided', () => {
        const action = Actions.toggleArtist();
        const state  = fromJS({ artistVisible: false });

        const expectedState = fromJS({ artistVisible: true });
        const actualState = reducer(state, action);

        expect(expectedState).to.equal(actualState);
      });
    });
  });
});
