import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import PlayButtons               from '../components/Samples';
import * as Actions             from '../ducks/samples.duck';
import { selectActionCreators } from '../helpers/duck.helpers';


function mapStateToProps(state) {
  const samplesState = state.get('samples');

  return {
    tracks:   samplesState.get('tracks'),
    playing:  samplesState.get('playing')
  };
}

function mapDispatchToProps(dispatch) {
  const validActionCreators = selectActionCreators(Actions);

  return {
    actions: bindActionCreators(validActionCreators, dispatch)
  };
}

export default connect( mapStateToProps, mapDispatchToProps )( PlayButtons );
