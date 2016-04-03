// This middleware sends user searches to the server, to store in the DB.
// This is how the front page knows what the "Recent Searches" are.
import { sendRecentSearch } from '../helpers/api.helpers';


export default function eventTracker(store) {
  return next => action => {
    // Ignore actions that haven't specified a sound.
    if ( !action.meta || !action.meta.event ) {
      return next(action);
    }

    const event = action.meta.event;

    switch ( event.type ) {
      case 'search':
        sendRecentSearch(event.payload);
        break;

      // TODO: Support more events?
      default:
        return console.warn(`Untracked event ${event.type}`);
    }

    return next(action)

  };
}
