import { circle } from '@ocobo/styled-system/patterns';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Avatar: React.FunctionComponent<AvatarProps> = ({
  className,
  alt,
  ...props
}) => {
  return (
    <img
      className={className ?? circle({ size: '[70px]' })}
      alt={alt}
      {...props}
    />
  );
};

Avatar.displayName = 'Avatar';

export { Avatar };
