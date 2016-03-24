import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import PlayButtons              from '../components/Samples';
import * as Actions             from '../ducks/samples.duck';
import { selectActionCreators } from '../helpers/duck.helpers';
import artistVisibleSelector    from '../selectors/artist-visible.selector';


function mapStateToProps(state) {
  return {
    tracks:   state.getIn(['samples', 'tracks']),
    playing:  state.getIn(['samples', 'playing']),
    visible:  artistVisibleSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  const validActionCreators = selectActionCreators(Actions);

  return {
    actions: bindActionCreators(validActionCreators, dispatch)
  };
}

export default connect( mapStateToProps, mapDispatchToProps )( PlayButtons );
