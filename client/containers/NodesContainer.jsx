import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Nodes                  from '../components/Nodes';
import * as nodeActions       from '../ducks/nodes.duck';
import nodesSelector          from '../selectors/nodes.selector';

function mapStateToProps(state) {
  return { nodes: state.get('nodes') };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(nodeActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Nodes );
