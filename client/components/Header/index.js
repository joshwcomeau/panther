import React, { Component }     from 'react';
import classNames               from 'classnames';

const Header = ({centered}) => {
  return (
    <header id="header" className={centered ? 'center' : 'default'}>
      Panther
    </header>
  );
}

export default Header
