import { Map, List, fromJS } from 'immutable';
import faker from 'faker';

import {
  CLICK_NODE
} from '../constants';


const initialState = fromJS({
  graveyard: {},
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
});

export default function Nodes(state = initialState, action) {
  switch (action.type) {
    case CLICK_NODE:
      // this will ultimately become more complex as API requests are integrated.
      // For now, we'll just:
      // - copy `present` to `past`
      // - copy the selected 'future' to `present`
      // - randomly generate 3 new nodes for future.
      return state
        .update( 'past', () => {
          return state.get('present')
        })
        .update( 'present', () => (
          state.get('future').find( artist =>
            action.node.get('name') === artist.get('name')
          )
        ))
        .set('future', fromJS([
          { name: faker.company.companyName() },
          { name: faker.internet.userName() },
          { name: faker.internet.userName() }
        ]));

    default:
      return state
  }
}
