import { expect }               from 'chai';
import { List, Map, fromJS }    from 'immutable';
import * as _                   from 'lodash';

import reducer                  from '../../client/ducks/samples.duck';
import * as duckStuff           from '../../client/ducks/samples.duck';

const { LOAD_TRACKS, loadTracks } = duckStuff;


describe('Samples Actions', () => {
  describe('loadTracks', () => {
    it('returns a LOAD_TRACKS action with mapped fields', () => {
      const input = [
        { id: 'a', preview_url: 'b', name: 'c' }
      ];

      const expectedOutput = {
        type: LOAD_TRACKS,
        tracks: [{
          id:   input[0].id,
          url:  input[0].preview_url,
          name: input[0].name
        }]
      };
      const actualOutput   = loadTracks(input);

      expect(expectedOutput).to.deep.equal(actualOutput);
    });

    it('limits it to the first 3 tracks', () => {
      const input = [
        { id: 'a', preview_url: 'b', name: 'c' },
        { id: 'd', preview_url: 'e', name: 'f' },
        { id: 'g', preview_url: 'h', name: 'i' },
        { id: 'j', preview_url: 'k', name: 'l' }
      ];

      const expectedOutput = {
        type: LOAD_TRACKS,
        tracks: [
          { id: input[0].id, url: input[0].preview_url, name: input[0].name },
          { id: input[1].id, url: input[1].preview_url, name: input[1].name },
          { id: input[2].id, url: input[2].preview_url, name: input[2].name }
        ]
      };
      const actualOutput   = loadTracks(input);

      expect(expectedOutput).to.deep.equal(actualOutput);
    });
  });
});
