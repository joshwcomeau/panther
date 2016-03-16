import { createSelector } from 'reselect'
import { PRESENT }        from '../config/regions';

const vertices = state => state.getIn(['graph', 'vertices']);

const presentVertexSelector = createSelector(
  [ vertices ],
  vertices => vertices.find( vertex => vertex.get('region') === PRESENT )
);

export default presentVertexSelector;
