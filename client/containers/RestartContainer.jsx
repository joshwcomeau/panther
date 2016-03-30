import { bindActionCreators }   from 'redux';
import { connect }              from 'react-redux';

import Restart                  from '../components/Restart';
import { restart }              from '../ducks/app.duck';


export default connect( false, { restart } )( Restart );
