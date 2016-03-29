import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Restart                  from '../components/Restart';
import { updateMode }           from '../ducks/app.duck';


export default connect( () => ({}), { updateMode } )( Restart );
