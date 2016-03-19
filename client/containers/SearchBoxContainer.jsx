import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import SearchBox                from '../components/Search/SearchBox.jsx';
import * as Actions             from '../ducks/search.duck';
import { selectArtist }         from '../ducks/graph.duck';
import { selectActionCreators } from '../helpers/duck.helpers';

function mapStateToProps(state) {
  return { search: state.get('search') };
}

function mapDispatchToProps(dispatch) {
  const validActionCreators = selectActionCreators(Actions);

  // Add in our Graph action.
  // This may be a bad pattern? There is a need for cross-concern communication,
  // though, and wrapping both ducks in a parent duck just for this seems silly.
  const mixedActionCreators = { selectArtist, ...validActionCreators };

  return {
    actions: bindActionCreators(mixedActionCreators, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( SearchBox );
