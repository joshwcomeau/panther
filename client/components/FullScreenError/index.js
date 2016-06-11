import React from 'react';


const FullScreenError = ({title, children}) => (
  <div className="full-screen-error">
    <div className="backdrop" />
    <div className="content">
      <header>
        <h2>{title}</h2>
      </header>

      {children}
    </div>
  </div>
);

export default FullScreenError;
