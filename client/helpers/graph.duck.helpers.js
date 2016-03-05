export const [ GRAVEYARD, PAST, PRESENT, FUTURE, WOMB ] = [ 0, 1, 2, 3, 4 ];

export function findPathToNode(state, id) {
  let foundGroupIndex, foundNodeIndex;

  state.get('nodeGroups').find( (group, groupIndex) => {
    return group.get('nodes').find( (node, nodeIndex) => {
      if ( node.get('id') === id ) {
        foundGroupIndex = groupIndex;
        foundNodeIndex = nodeIndex;

        // We're returning true simply to stop the execution of the function;
        // We don't actually care about the return values of these find calls.
        return true;
      }
    });
  });

  return [ foundGroupIndex, foundNodeIndex ];
}

export function findCenterOfNode(domNode) {
  const box = domNode.getBoundingClientRect();

  return {
    x: Math.round(box.left + (box.width / 2)),
    y: Math.round(box.top + (box.height / 2))
  };
}

export function calculateLineLength(x1, y1, x2, y2) {
  return Math.sqrt( Math.pow( (x1 - x2), 2 ) + Math.pow( (y1 - y2), 2 ) );
}

export function findCoordinatesForNodes() {
  const domNodes = document.querySelectorAll('.node');

  return Array.prototype.reduce.call(domNodes, (acc, node) => {
    acc[node.getAttribute('data-id')] = findCenterOfNode(node);
    return acc;
  }, {});
}
