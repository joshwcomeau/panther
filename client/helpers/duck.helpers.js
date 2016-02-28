import pickBy     from 'lodash/pickBy';
import isFunction from 'lodash/isFunction';

console.log(pickBy, isFunction)

// When exporting from ducks, the default export is the reducer.
// Other exports are action types (the constants), and action creators.
// We want to pick the action creators from this imported object, so that
// we can pass it right along to bindActionCreators.
export function selectActionCreators(importedObj) {
  return pickBy(importedObj, isFunction);
}
