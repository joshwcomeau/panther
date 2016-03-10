import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import ArtistAvatar             from '../components/ArtistInfo/ArtistAvatar.jsx';


function mapStateToProps(state) {
  return {
    images: state.getIn(['graph', 'nodeGroups', 2, 'nodes', 0, 'images']),
    artistVisible: state.getIn(['artistInfo', 'artistVisible'])
  };
}

function mapDispatchToProps(dispatch) {
  // None yet!
  return {};
}

export default connect( mapStateToProps, mapDispatchToProps )( ArtistAvatar );
