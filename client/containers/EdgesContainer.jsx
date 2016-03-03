import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Edges                    from '../components/Graph/Edges.jsx';
import edgesSelector            from '../selectors/edges.selector';



function mapStateToProps(state) {
  return edgesSelector(state);
}

function mapDispatchToProps(dispatch) {
  // I believe no actions are necessary for edges!
  return {
    actions: {}
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Edges );
