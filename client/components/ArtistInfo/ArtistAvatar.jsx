import React, { Component, PropTypes } from 'react';

import { artistAvatarLength } from '../../config/timing';

const DEFAULT_AVATAR = 'https://s3.amazonaws.com/joshmisc/default-avatar.png';


const ArtistAvatar = ({images, artistVisible}) => {
  const avatarUrl = getSmallestAcceptableImage(images);
  const styles = {
    opacity: artistVisible ? 1 : 0.75,
    transform: artistVisible ? 'translateY(0) scale(1, 1)' : 'translateY(230px) scale(0, 0)',
    borderRadius: artistVisible ? '0px' : '100%',
    backgroundImage: `url('${avatarUrl}')`,
    transition: artistVisible
                ? `opacity ${artistAvatarLength}ms ease,
                   transform ${artistAvatarLength}ms ease,
                   border-radius ${artistAvatarLength}ms ease-out 150ms`
                : `opacity ${artistAvatarLength}ms ease,
                   transform ${artistAvatarLength}ms ease,
                   border-radius ${artistAvatarLength}ms ease`
  };

  return (
    <div
      className="artist-avatar"
      style={styles}
    />
  );
};

function getSmallestAcceptableImage(images) {
  if ( !images || !images.size ) return DEFAULT_AVATAR;

  const minWidth = window.innerWidth / 3;
  let image = images.reverse().find( image => {
    return image.get('width') > minWidth
  });

  // If none of the images are big enough, pick the biggest one.
  if ( !image ) image = images.get(0);

  return image.get('url');
}


export default ArtistAvatar;
