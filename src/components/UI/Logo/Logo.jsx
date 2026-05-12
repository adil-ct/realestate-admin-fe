import React from 'react';

/**
 * Occurrence brand logo.
 * The SVG art lives in /public so it stays canonical and out of the JS bundle.
 *
 *   <Logo height={40} tone="dark" />   // dark backgrounds (top bar, sidebar)
 *   <Logo height={36} />               // light backgrounds (default tone="light")
 */
const LOGO_RATIO = 480 / 140; // canonical SVG viewBox aspect ratio

const Logo = ({ height = 36, tone = 'light', className = '', style, alt = 'Occurrence' }) => {
  const src = tone === 'dark' ? '/occurrence_logo_dark.svg' : '/occurrence_logo.svg';
  const width = Math.round(height * LOGO_RATIO);

  return (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={className}
      style={{ display: 'block', height, width, ...style }}
      draggable={false}
    />
  );
};

export default Logo;
