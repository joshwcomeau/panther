import { expect }               from 'chai';
import { List, Map, fromJS }    from 'immutable';
import * as _                   from 'lodash';

import { selectActionCreators } from '../../client/helpers/duck.helpers';
import reducer                  from '../../client/ducks/samples.duck';
import * as duckStuff           from '../../client/ducks/samples.duck';

const Actions = selectActionCreators(duckStuff);
const {
  LOAD_TRACKS,
  UNLOAD_TRACKS,
  PLAY_TRACK,
  STOP
} = duckStuff;


describe('Samples reducer', () => {
  it(LOAD_TRACKS, () => {
    const state = reducer();
    // Not using the action creator here, because it's non-trivial
    const action = {
      type: LOAD_TRACKS,
      tracks: [
        { id: 'a', url: 'www.track.com', name: 'Track1' },
        { id: 'b', url: 'www.kcart.com', name: 'Track2' }
      ]
    };

    const expectedState = fromJS({
      tracks: action.tracks,
      playing: null
    });
    const actualState = reducer(state, action);

    expect(actualState).to.equal(expectedState);
  })
});
