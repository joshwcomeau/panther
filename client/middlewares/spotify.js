import { spotifyRequest } from '../helpers/spotify.helpers';


const spotify = store => next => action => {
  // This middleware depends on `fetch` and promises being available.

  // ignore non-spotify actions
  if ( !action.meta || !action.meta.spotify ) return next(action);

  // Send the action immediately on to the reducer, for any optimistic stuff.
  next(action);

  // Allow dispatching of success/failure callbacks
  action.meta.spotify.onSuccess = (response) => {
    store.dispatch(action.meta.spotify.onSuccessAction(response))
  }
  action.meta.spotify.onFailure = (err) => {
    store.dispatch(action.meta.spotify.onFailureAction(err))
  }

  spotifyRequest(action.meta.spotify);

};


export default spotify
