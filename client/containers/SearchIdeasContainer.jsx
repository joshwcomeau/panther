import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import SearchIdeas              from '../components/Search/SearchIdeas.jsx';
import { updateArtistUrl }      from '../ducks/app.duck';


export default connect( false, { updateArtistUrl } )( SearchIdeas );
