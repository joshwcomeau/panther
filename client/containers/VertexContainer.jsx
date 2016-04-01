import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Vertex                   from '../components/Graph/Vertex.jsx';
import { updateUrl }            from '../ducks/app.duck';



function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    artist:   state.get('artists').get(ownProps.id)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ updateUrl }, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Vertex );
