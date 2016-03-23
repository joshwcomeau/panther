import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Home                     from '../components/Home';
import { selectArtist }         from '../ducks/graph.duck';

function mapStateToProps(state) {
  return {
    graph: state.get('graph'),
    search: state.get('search')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ selectArtist }, dispatch)
  };
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );
