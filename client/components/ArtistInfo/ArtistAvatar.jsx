import React, { Component, PropTypes } from 'react';

const ArtistAvatar = ({src}) => (
  <div
    className="artist-avatar"
    style={{backgroundImage: `url('${src}')`}}
  />
);

export default ArtistAvatar;
