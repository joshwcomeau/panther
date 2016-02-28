import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Nodes                    from '../components/Nodes';
import * as nodeActions         from '../ducks/nodes.duck';
import { selectActionCreators } from '../helpers/duck.helpers';

function mapStateToProps(state) {
  return { nodes: state.get('nodes') };
}

function mapDispatchToProps(dispatch) {
  console.log("Node actions", nodeActions)
  const validActionCreators = selectActionCreators(nodeActions);
  console.log("Valid", validActionCreators)
  return {
    actions: bindActionCreators(validActionCreators, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Nodes );
