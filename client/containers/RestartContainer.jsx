import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Restart                  from '../components/Restart';
import { updateUrl }            from '../ducks/app.duck';


export default connect( false, { updateUrl } )( Restart );
