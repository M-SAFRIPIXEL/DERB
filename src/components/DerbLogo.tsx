import React from 'react';

interface DerbLogoProps {
  className?: string;
  size?: number;
  width?: number | string;
  height?: number | string;
  alt?: string;
}

export const DerbLogo: React.FC<DerbLogoProps> = ({
  className = '',
  size,
  width,
  height,
  alt = 'DERB Logo',
}) => {
  const inlineStyle: React.CSSProperties = {};
  if (size) {
    inlineStyle.height = `${size}px`;
    inlineStyle.width = 'auto';
  } else {
    if (width) inlineStyle.width = typeof width === 'number' ? `${width}px` : width;
    if (height) inlineStyle.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <img
      src="/logo.svg"
      alt={alt}
      style={inlineStyle}
      className={`inline-block object-contain select-none shrink-0 ${className}`}
      loading="eager"
      onError={(e) => {
        const target = e.currentTarget;
        if (!target.src.endsWith('logo.png')) {
          target.src = '/logo.png';
        }
      }}
    />
  );
};
