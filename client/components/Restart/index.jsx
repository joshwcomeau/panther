import React from 'react';

import CaretLeft from './CaretLeft.jsx';


const Restart = ({restart}) => {
  return <div id="restart" onClick={restart}>
    <CaretLeft size={45} />
    Start Over
  </div>
};

export default Restart;
