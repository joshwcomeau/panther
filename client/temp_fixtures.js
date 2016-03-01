import faker from 'faker';


export const nodesData = {
  nodeGroups: [
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
  ]
};
