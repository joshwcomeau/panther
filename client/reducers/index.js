import { Map, List, fromJS }  from 'immutable';
import faker from 'faker';

import { CLICK_NODE } from '../constants';


/*
State shape:

{
  nodes: {
    past: {
      name: 'Bloody Beetroots',
      image: 'http://',
      genres: ['country'],
      audioSamples: ['url1']
    },
    present: {
      name: 'Hot Pink Delorean',
      image: '', genres: [], audioSamples: []
    },
    future: [
      { name: 'deadmau5' },
      { name: 'Shania Twain' },
      { name: 'Julia Louis-Dreyfus' }
    ]
  }
}
*/

const initialState = fromJS({
  nodes: {
    past: {
      name: faker.internet.userName(),
      image: faker.image.avatar(),
      genres: ['country'],
      audioSamples: ['url1', 'url2', 'url3']
    },
    present: {
      name: faker.internet.userName(),
      image: faker.image.avatar(),
      genres: ['electronica', 'nu wave'],
      audioSamples: ['url1', 'url2', 'url3']
    },
    future: [
      { name: faker.company.companyName() },
      { name: faker.internet.userName() },
      { name: faker.internet.userName() }
    ]
  }
});

const rootReducer = ( state = Map(), action ) => {
  switch (action.type) {
    case CLICK_NODE:
      // this will ultimately become more complex as API requests are integrated.
      // For now, we'll just:
      // - copy `present` to `past`
      // - copy the selected 'future' to `present`
      // - randomly generate 3 new nodes for future.
      return state
        .update('past', state => state.present)
        .update('present', state => (
          state.future.find( artist =>
            action.artistName = artist.get('name')
          )
        ))
        .set('future', [
          { name: faker.company.companyName() },
          { name: faker.internet.userName() },
          { name: faker.internet.userName() }
        ]);

    default:
      return state
  }
}

export default rootReducer
