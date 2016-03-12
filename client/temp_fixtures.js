import faker from 'faker';


export const vertexData = {
  vertices: [
    {
      id: 'a',
      name: 'ghostman',
      region: GRAVEYARD,
      regionIndex: 0,
      rejected: false
    }, {
      id: 'b',
      name: 'Yesterdays News',
      region: PAST,
      regionIndex: 0,
      rejected: false
    }, {
      id: 'c',
      name: 'Front and Center',
      region: PRESENT,
      regionIndex: 0,
      rejected: false
    }, {
      id: 'd',
      name: 'Potential Future 1',
      region: FUTURE,
      regionIndex: 0,
      rejected: false
    }, {
      id: 'e',
      name: 'Potential Future 2',
      region: FUTURE,
      regionIndex: 1,
      rejected: false
    }, {
      id: 'f',
      name: 'Potential Future 3',
      region: FUTURE,
      regionIndex: 2,
      rejected: false
    }
  ],
  edges: [
    {
      from: 'a', to: 'b'
    }, {
      from: 'b', to: 'c'
    }, {
      from: 'c', to: 'd'
    }, {
      from: 'c', to: 'e'
    }, {
      from: 'c', to: 'f'
    }
  ]
};
