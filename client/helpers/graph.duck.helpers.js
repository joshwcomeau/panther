export const [ GRAVEYARD, PAST, PRESENT, FUTURE, WOMB ] = [ 0, 1, 2, 3, 4 ];

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
