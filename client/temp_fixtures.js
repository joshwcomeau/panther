import faker from 'faker';


export const nodesData = {
  nodeGroups: [
    {
      id: 0,
      nodes: []
    },{
      id: 1,
      nodes: []
    }, {
      id: 2,
      nodes: [
        {
          id: '12',
          name: faker.internet.userName(),
          image: faker.image.avatar(),
          genres: ['electronica', 'nu wave'],
          audioSamples: ['url1', 'url2', 'url3']
        }
      ]
    }, {
      id: 3,
      nodes: [
        { id: '13', name: faker.company.companyName() },
        { id: '14', name: faker.company.companyName() },
        { id: '15', name: faker.company.companyName() }
      ]
    }, {
      id: 4,
      nodes: []
    }
  ]
};
