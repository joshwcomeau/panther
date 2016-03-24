import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import artistVisibleSelector    from '../selectors/artist-visible.selector';
import artistAvatarUrlSelector  from '../selectors/artist-avatar-url.selector';

import ArtistAvatar from '../components/ArtistAvatar';


function mapStateToProps(state) {
  return {
    artistAvatarUrl:  artistAvatarUrlSelector(state),
    artistVisible:    artistVisibleSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  // None yet!
  return {};
}

export default connect( mapStateToProps, mapDispatchToProps )( ArtistAvatar );
