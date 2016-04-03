import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Graph                    from '../components/Graph';
import * as Actions             from '../ducks/graph.duck';
import { selectActionCreators } from '../helpers/duck.helpers';

function mapStateToProps(state) {
  return {
    vertices: state.getIn(['graph', 'vertices']),
    edges:    state.getIn(['graph', 'edges'])
  };
}

function mapDispatchToProps(dispatch) {
  const validActionCreators = selectActionCreators(Actions);

  return {
    actions: bindActionCreators(validActionCreators, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Graph );
