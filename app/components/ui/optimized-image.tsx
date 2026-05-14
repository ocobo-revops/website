interface OptimizedImageProps {
  src: string;
  alt: string;
  // Provide width + height when known — prevents CLS by reserving layout space
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...(priority
        ? { loading: 'eager', fetchPriority: 'high' }
        : { loading: 'lazy', decoding: 'async' })}
    />
  );
}

export { OptimizedImage };
