import { createSelector } from 'reselect'
import _                  from 'lodash';

// In our state, we store nodes.
// Edges are derived values, by linking nodes.
// We can tell where the links need to happen simply by the nodes' position.
// Every node in group A links to every node in group B, etc.
const edgesSelector      = state => {
  let edges = [];
  const groups = state.get('graph').get('nodeGroups');

  groups.forEach( (group, groupIndex) => {
    // We're making lines, essentially. One line per node for each node in the
    // NEXT group.
    // eg:
    //      /-----> o
    //     /
    //   o -------> o
    //
    // Because there is 1 node in this group and two nodes in the next group,
    // we need (1 * 2 = 2) edges.

    // If this group has 0 nodes, we can return
    if ( !group.get('nodes') || !group.get('nodes').size ) return;

    const nextGroup = groups.get(groupIndex+1);

    // If this is the final group, no edges are necessary.
    if ( !nextGroup ) return;

    group.get('nodes').forEach( node => {
      nextGroup.get('nodes').forEach( nextNode => {
        // If the nodes don't have coordinates, don't include the edges.
        if ( !nextNode.get('y') ) return;

        // Calculate the line length. Will be useful for animations
        const length = Math.sqrt(
          Math.pow( (nextNode.get('x') - node.get('x')), 2 ) +
          Math.pow( (nextNode.get('y') - node.get('y')), 2 )
        )

        edges.push({
          x1: node.get('x'),
          y1: node.get('y'),
          x2: nextNode.get('x'),
          y2: nextNode.get('y'),
          length,
          retracting: nextNode.get('rejected'),
          pulling:    nextNode.get('pulling')
        });
      });
    });
  });

  return edges;
};

// Let's also provide groups, just to be safe.
// TODO: Remove this if it doesn't prove useful.
const nodeGroupsSelector = state => state.get('graph').get('nodeGroups');

export default createSelector(
  edgesSelector, nodeGroupsSelector,
  (edges, nodeGroups) => {
    return {
      edges,
      nodeGroups
    }
  }
);
