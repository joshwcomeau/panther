import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Nodes                  from '../components/Nodes';
import * as Actions           from '../actions';

function mapStateToProps(state) {
  return { nodes: state.get('nodes') };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Nodes );
