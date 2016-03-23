import toPairs from 'lodash/toPairs';


const ROOT_URL = 'https://api.spotify.com/v1';

export function fetchRelatedArtists(artistId) {
  return fetchFromAPI({ endpoint: `artists/${artistId}/related-artists`});
}

export function fetchTopTracks(artistId) {
  return fetchFromAPI({
    endpoint: `artists/${artistId}/top-tracks`,
    params: {
      country: 'US'
    }
  });
}

export function fetchSearchResults(q, type = 'artist') {
  return fetchFromAPI({
    endpoint: 'search',
    params: {
      type,
      q
    }
  });
}

export function fetchArtistInfo(artistId) {
  return fetchFromAPI({
    endpoint: `artists/${artistId}`
  });
}

export default function fetchFromAPI({endpoint, params}) {
  let url = `${ROOT_URL}/${endpoint}`;

  if ( params ) {
    const paramString = toPairs(params).map(param => param.join('=')).join('&');
    url += `?${paramString}`;
  }

  return fetch(url).then(checkStatus).then( response => response.json() );
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
