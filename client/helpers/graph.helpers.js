import { Map, List, fromJS } from 'immutable';

import { CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE } from '../config/regions';


export function calculateLineLength(x1, y1, x2, y2) {
  return Math.sqrt( Math.pow( (x1 - x2), 2 ) + Math.pow( (y1 - y2), 2 ) );
}

export function getPreviousRegion(region) {
  if ( region === CATACOMBS ) return null;

  const sortedRegions = [CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE];
  return sortedRegions[sortedRegions.indexOf(region) - 1];
}

export function getNextRegion(region) {
  if ( region === FUTURE ) return null;

  const sortedRegions = [CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE];
  return sortedRegions[sortedRegions.indexOf(region) + 1];
}

function getVerticesInNextRegion(vertices, currentRegion) {
  const nextRegion = getNextRegion(currentRegion);
  if ( !nextRegion ) return [];

  return vertices.filter( vertex => vertex.get('region') === nextRegion);
}

export function recalculateEdges(vertices) {
  let edges = [];

  vertices.forEach( vertex => {
    // Find the vertices in the next region
    const nextVertices = getVerticesInNextRegion(vertices, vertex.get('region'));

    // Create an edge from this vertex to each nextVertex
    nextVertices.forEach( nextVertex => {
      edges.push({
        from: vertex.get('id'),
        to:   nextVertex.get('id')
      });
    });
  });

  return fromJS(edges);
}
