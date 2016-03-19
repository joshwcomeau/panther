import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import {
  artistVisibleSelector, imagesSelector
} from '../selectors/artist-avatar.selector';

import ArtistAvatar from '../components/ArtistInfo/ArtistAvatar.jsx';


function mapStateToProps(state) {
  return {
    images: imagesSelector(state),
    artistVisible: artistVisibleSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  // None yet!
  return {};
}

export default connect( mapStateToProps, mapDispatchToProps )( ArtistAvatar );
