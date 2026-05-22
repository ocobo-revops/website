type OptimizedImageBase = {
  src: string;
  alt: string;
  className?: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
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
  onError,
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={onError}
      {...(priority
        ? ({
            loading: 'eager',
            // React 18.3.1's DOM allow-list lacks fetchPriority — keep it
            // lowercase so it ships as the standard HTML attribute without
            // triggering the unknown-prop dev warning.
            fetchpriority: 'high',
          } as React.ImgHTMLAttributes<HTMLImageElement>)
        : { loading: 'lazy', decoding: 'async' })}
    />
  );
}

export { OptimizedImage };
