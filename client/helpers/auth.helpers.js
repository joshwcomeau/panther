import noop from 'lodash/noop';

import { fetchAccessToken } from './api.helpers';


const TOKEN_KEY = 'panther-audio-access-token';
let isFetching  = false;

export function getAccessToken(callback = noop) {
  // To make authenticated requests to Spotify (and benefit from a higher rate-
  // limit), we need to proxy a request for an access token through our server.
  // The first step is to check if we already have it, in localStorage.
  const storedTokenString = localStorage.getItem(TOKEN_KEY);

  if ( storedTokenString ) {
    const storedToken = JSON.parse(storedTokenString);

    // Check to see if it's expired.
    const isExpired = Date.now() > storedToken.expiration;

    // If it's still valid, we don't need to make a server request :)
    if ( !isExpired ) {
      // Wrapping this in a setTimeout, so that this function is always async.
      // For predictability and to avoid JS weirdness.
      return window.setTimeout( () => callback(storedToken) )
    }
  }

  // BLock concurrent requests.
  // When the app first loads, this function is invoked to fetch the token.
  // Let's imagine, though, that the server is slow, and the user starts trying
  // to use the app before the original request has resolved.
  // In that case, we don't want to create a new request for a token, since
  // we'll have one shortly. Instead, just return early.
  // This works, because the access token is _optional_. We can make
  // unauthenticated requests if we really need to.
  if ( isFetching ) return callback(null);

  isFetching = true;

  // Make a request to our back-end to generate a token.
  fetchAccessToken()
    .then( response => {
      // The received token will be of type:
      // {
      //  "access_token": "BQCHMB...rDw",
      //  "token_type": "Bearer",
      //  "expires_in": 3600
      // }
      //
      // We want to convert that `expires_in` into a unix timestamp.
      //
      // We're also going to subtract 20s, since the countdown started from
      // when the token was generated, on Spotify's servers.
      const expiresInMs = (response.expires_in - 20) * 1000;
      const expirationTimestamp = Date.now() + expiresInMs;

      const token = {
        value:      response.access_token,
        expiration: expirationTimestamp
      };

      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));

      // Reset our 'fetching' flag.
      isFetching = false;

      return callback(token);
    })
    .catch( err => {
      console.error("Error fetching token from server", err);

      // Argh, no `finally` on the Fetch polyfill :(
      isFetching = false;
    });
}
