import React, { Component, PropTypes } from 'react';

import { artistAvatarLength } from '../../config/timing';



const ArtistAvatar = ({artistAvatarUrl, artistVisible}) => {
  const styles = {
    opacity: artistVisible ? 1 : 0.75,
    transform: artistVisible ? 'translateY(0) scale(1, 1)' : 'translateY(230px) scale(0, 0)',
    borderRadius: artistVisible ? '0px' : '100%',
    backgroundImage: `url('${artistAvatarUrl}')`,
    transition: artistVisible
                ? `opacity ${artistAvatarLength}ms ease,
                   transform ${artistAvatarLength}ms ease,
                   border-radius ${artistAvatarLength}ms ease-out 150ms`
                : `opacity ${artistAvatarLength}ms ease,
                   transform ${artistAvatarLength}ms ease,
                   border-radius ${artistAvatarLength}ms ease`
  };

  return (
    <div id="artist-avatar-wrapper">
      <div id="artist-avatar" style={styles} />
      <div className="node-spacer" />
    </div>
  );
};



export default ArtistAvatar;
