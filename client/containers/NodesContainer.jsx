import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Nodes                  from '../components/Nodes';
import * as Actions           from '../actions';
import nodesSelector          from '../selectors/nodes.selector';

function mapStateToProps(state) {
  return nodesSelector(state);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Nodes );
