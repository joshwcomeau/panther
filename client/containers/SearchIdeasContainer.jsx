import { bindActionCreators }     from 'redux';
import { connect }                from 'react-redux';

import SearchIdeas                from '../components/Search/SearchIdeas.jsx';
import { requestRecentSearches }  from '../ducks/search.duck';
import { updateUrl }              from '../ducks/app.duck';


function mapStateToProps(state) {
  return {
    recent: state.getIn(['search', 'recent'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ updateUrl, requestRecentSearches }, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( SearchIdeas );
