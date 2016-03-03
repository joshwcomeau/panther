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

export function findNodeGroupById(state, id) {
  return findEntry({
    state,
    path: ['nodeGroups'],
    matchKey: 'id',
    matchVal: id
  });
}

export function findNodeById(state, id, section=FUTURE) {
  return findEntry({
    state,
    path: ['nodeGroups', section],
    matchKey: 'id',
    matchVal: id
  });
}

function findEntry({ state, path, matchKey, matchVal }) {
  const match = state.getIn(path).findEntry( item => {
    return item.get(matchKey) === matchVal;
  });

  if ( !match ) {
    console.error("No group found with", matchKey, matchVal, "in state", state.toJS());
  }

  return match;
}
