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
        // If the nodes don't have coordinates, don't push the edges.
        // TODO: This probably only needs to be necessary
        if ( !node.get('x') ) return;

        edges.push({
          x1: node.get('x'),
          y1: node.get('y'),
          x2: nextNode.get('x'),
          y2: nextNode.get('y')
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
