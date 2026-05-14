type OptimizedImageBase = {
  src: string;
  alt: string;
  className?: string;
};

// When priority=true, width+height are required to prevent CLS on non-absolute images.
type OptimizedImageProps =
  | (OptimizedImageBase & { priority: true; width: number; height: number })
  | (OptimizedImageBase & {
      priority?: false;
      width?: number;
      height?: number;
    });

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
