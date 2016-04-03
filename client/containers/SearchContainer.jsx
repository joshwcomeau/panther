import { bindActionCreators }     from 'redux';
import { connect }                from 'react-redux';

import Search                     from '../components/Search';
import { requestRecentSearches }  from '../ducks/search.duck';

function mapStateToProps(state) {
  return { search: state.get('search') };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ requestRecentSearches }, dispatch)
  }
}


export default connect( mapStateToProps, mapDispatchToProps )( Search );
