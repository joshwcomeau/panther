import React, { Component, PropTypes } from 'react';

const DEFAULT_AVATAR = 'https://s3.amazonaws.com/joshmisc/default-avatar.png';

const ArtistAvatar = ({images}) => (
  <div
    className="artist-avatar"
    style={{backgroundImage: `url('${getSmallestAcceptableImage(images)}')`}}
  />
);

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
