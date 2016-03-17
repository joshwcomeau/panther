import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Home                     from '../components/Home';

function mapStateToProps(state) {
  return {
    graph: state.present.get('graph'),
    search: state.present.get('search')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {}
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );
