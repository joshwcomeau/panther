import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Search                   from '../components/Search';
import * as Actions             from '../ducks/search.duck';
import { selectActionCreators } from '../helpers/duck.helpers';

function mapStateToProps(state) {
  return { search: state.get('search') };
}

function mapDispatchToProps(dispatch) {
  const validActionCreators = selectActionCreators(Actions);

  return {
    actions: bindActionCreators(validActionCreators, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Search );
