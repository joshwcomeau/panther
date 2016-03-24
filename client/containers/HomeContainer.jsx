import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Home                     from '../components/Home';
import { selectArtist }         from '../ducks/graph.duck';
import { updateMode }           from '../ducks/app.duck';

function mapStateToProps(state) {
  return {
    graph:  state.get('graph'),
    search: state.get('search'),
    mode:   state.getIn(['app', 'mode'])
  };
}

function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators({ selectArtist, updateMode }, dispatch);

  return { actions };
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );
