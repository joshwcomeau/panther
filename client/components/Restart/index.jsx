import React from 'react';

import CaretLeft from './CaretLeft.jsx';


const Restart = ({updateMode}) => {
  return <div id="restart" onClick={updateMode.bind(null, 'search')}>
    <CaretLeft size={45} />
    Start Over
  </div>
};

export default Restart;
