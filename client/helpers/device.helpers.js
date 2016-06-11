export const isMobile = () => {
  const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone/i;

  return !!mobileRegex.test(navigator.userAgent);
}
