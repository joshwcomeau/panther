export const [ GRAVEYARD, PAST, PRESENT, FUTURE, WOMB ] = [ 0, 1, 2, 3, 4 ];


export function getNodeIndex(state, actionNode, section = FUTURE) {
  const entry = state
    .getIn([FUTURE, 'nodes'])
    .findEntry( node =>  node.get('name') === actionNode.get('name') );
  if ( entry && entry.length) { return entry[0]; }
}
