import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import SearchIdeas              from '../components/Search/SearchIdeas.jsx';
import { updateUrl }            from '../ducks/app.duck';


export default connect( false, { updateUrl } )( SearchIdeas );
