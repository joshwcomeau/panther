import { createSelector } from 'reselect'
import selectedArtist from './selected-artist.selector';


const DEFAULT_AVATAR = 'https://s3.amazonaws.com/joshmisc/default-avatar.png';

const imagesSelector = createSelector(
  [ selectedArtist ],
  ( selectedArtist ) => {
    if ( !selectedArtist ) return null;

    const images = selectedArtist.get('images');

    return getSmallestAcceptableImage(images);
  }
);

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

export default imagesSelector;
