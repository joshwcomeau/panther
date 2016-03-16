import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';

import selectedArtist         from '../selectors/selected-artist.selector';
import ArtistAvatar           from '../components/ArtistInfo/ArtistAvatar.jsx';


function mapStateToProps(state) {
  return {
    artist: null
  };
}

function mapDispatchToProps(dispatch) {
  // None yet!
  return {};
}

export default connect( mapStateToProps, mapDispatchToProps )( ArtistAvatar );
