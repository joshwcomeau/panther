import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import ArtistInfo               from '../components/ArtistInfo';

function mapStateToProps(state) {
  return { artist: state.getIn(['graph', 'nodeGroups', 2, 'nodes', 0]) };
}

function mapDispatchToProps(dispatch) {
  // None yet!
  return {};
}

export default connect( mapStateToProps, mapDispatchToProps )( ArtistInfo );
