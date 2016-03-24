export function getQueryVariable(desiredVariableName) {
  const query = window.location.search.substring(1);

  // Transform the query string into an object with the variables as the names,
  // and the values as the results.
  // 'a=b&hi=5' -> { a: 'b', hi: '5' }
  const queryVariables = query.split('&').reduce( (memo, varString) => {
    const [ varName, varValue ] = varString.split('=');
    memo[varName] = varValue;
    return memo;
  }, {});

  return queryVariables[desiredVariableName];
}

export function getArtistIdFromUrl(url) {
  const artistIdRegex = /^\/artist\/(.+)/;
  const artistIdMatch = artistIdRegex.exec(url);

  if ( !artistIdMatch ) return null;

  const [ fullMatch, artistId ] = artistIdMatch;
  return artistId;
}
