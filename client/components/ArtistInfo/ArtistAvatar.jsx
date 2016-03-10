import React, { Component, PropTypes } from 'react';

const DEFAULT_AVATAR = 'https://s3.amazonaws.com/joshmisc/default-avatar.png';


const ArtistAvatar = ({images, artistVisible}) => {
  const avatarUrl = getSmallestAcceptableImage(images);
  const styles = {
    opacity: artistVisible ? 1 : 0,
    transform: artistVisible ? 'translateY(0)' : 'translateY(-50px)',
    backgroundImage: `url('${avatarUrl}')`,
    transition: artistVisible
                ? 'opacity 1s ease 250ms'
                : 'opacity 500ms, transform 1s ease 250ms'
  };

  return (
    <div
      className="artist-avatar"
      style={styles}
    />
  );
};

function getSmallestAcceptableImage(images) {
  console.log("Getting smallest", images, DEFAULT_AVATAR)
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
