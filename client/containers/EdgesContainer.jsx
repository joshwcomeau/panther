import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Edges                    from '../components/Graph/Edges.jsx';



function mapStateToProps(state) {
  return { edges: state.get('graph').get('edges') }
}

function mapDispatchToProps(dispatch) {
  // I believe no actions are necessary for edges!
  return {
    actions: {}
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Edges );
