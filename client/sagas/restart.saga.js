import { take, call, put } from 'redux-saga/effects';

import { RESTART, updateMode }  from '../ducks/app.duck';
import { emptyGraph }           from '../ducks/graph.duck';
import { unloadTracks }         from '../ducks/samples.duck';


export function* restart() {
  while (true) {
    const action = yield take(RESTART);

    yield [
      put(updateMode('search')),
      put(emptyGraph()),
      put(unloadTracks())
    ];
  }
}
