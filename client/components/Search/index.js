import React, { Component, PropTypes } from 'react';

import SearchBoxContainer from '../../containers/SearchBoxContainer';


const Search = () => (
  <section id="search">
    <header>Panther</header>
    <h1>Discover new music through an infinite suggestion graph.</h1>
    <h3>Enter the name of an artist you like:</h3>
    <SearchBoxContainer />
  </section>
);

export default Search;
