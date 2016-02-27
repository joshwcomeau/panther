import { Map, List, fromJS } from 'immutable';
import faker from 'faker';

import {
  CLICK_NODE
} from '../constants';


const initialState = fromJS([
  {
    id: 0,
    nodes: []
  },{
    id: 1,
    nodes: [
      {
        name: faker.internet.userName(),
        image: faker.image.avatar(),
        genres: ['country'],
        audioSamples: ['url1', 'url2', 'url3']
      }
    ]
  }, {
    id: 2,
    nodes: [
      {
        name: faker.internet.userName(),
        image: faker.image.avatar(),
        genres: ['electronica', 'nu wave'],
        audioSamples: ['url1', 'url2', 'url3']
      }
    ]
  }, {
    id: 3,
    nodes: [
      { name: faker.company.companyName() },
      { name: faker.internet.userName() },
      { name: faker.internet.userName() }
    ]
  }, {
    id: 4,
    nodes: []
  }
]);

export default function Nodes(state = initialState, action) {
  switch (action.type) {
    case CLICK_NODE:
      // this will ultimately become more complex as API requests are integrated.
      // For now, we'll just:
      // - drop the first group (it's the graveyard)
      // - remove the non-clicked nodes
      // - add a new group of random nodes
      let newGroupId = state.get(-1).get('id') + 1;

      return state
        .delete(0)
        .updateIn([-2, 'nodes'], nodes => {
          return nodes.filter( node => {
            console.log("comparing", action.node.get('name'), node.get('name'))
            return action.node.get('name') === node.get('name')
          })
        })
        .setIn([-1, 'nodes'], fromJS([
          { name: faker.company.companyName() },
          { name: faker.internet.userName() },
          { name: faker.internet.userName() }
        ]))
        .push(fromJS({
          id: newGroupId,
          nodes: []
        }));

    default:
      return state
  }
}
