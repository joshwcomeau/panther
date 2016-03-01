import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Graph                    from '../components/Graph';
import * as Actions             from '../ducks/graph.duck';
import { selectActionCreators } from '../helpers/duck.helpers';

function mapStateToProps(state) {
  return { nodeGroups: state.get('graph').get('nodeGroups') };
}

function mapDispatchToProps(dispatch) {
  const validActionCreators = selectActionCreators(Actions);

  return {
    actions: bindActionCreators(validActionCreators, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Graph );
