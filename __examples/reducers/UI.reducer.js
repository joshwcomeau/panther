import { Map, fromJS } from 'immutable';

import {
  OPEN_MENU,
  CLOSE_MENU,
  SET_AND_DISPLAY_FLASH,
  DISMISS_FLASH
} from '../constants/actions.constants';

// Initial state for the 'UI' slice of the state.
export const initialState = Map();

export default function UI(state = initialState, action) {
  switch (action.type) {
    case OPEN_MENU:
      return state.set('menu', action.menu);
    case CLOSE_MENU:
      return state.delete('menu');
    case SET_AND_DISPLAY_FLASH:
      return state.set('flash', fromJS(action.flash));
    case DISMISS_FLASH:
      return state.delete('flash');
    default:
      return state
  }
}
