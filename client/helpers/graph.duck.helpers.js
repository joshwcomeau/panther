export function calculateLineLength(x1, y1, x2, y2) {
  return Math.sqrt( Math.pow( (x1 - x2), 2 ) + Math.pow( (y1 - y2), 2 ) );
}
