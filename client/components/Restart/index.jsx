import React from 'react';

import CaretLeft from './CaretLeft.jsx';


const Restart = ({updateUrl}) => {
  return <div id="restart" onClick={() => updateUrl()}>
    <CaretLeft size={45} />
    Start Over
  </div>
};

export default Restart;
