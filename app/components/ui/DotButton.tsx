import { css } from '@ocobo/styled-system/css';
import { styled } from '@ocobo/styled-system/jsx';

const Button = styled('button', {
  base: {
    color: 'current',
  },
});

interface DotButtonProps extends React.ComponentProps<typeof Button> {
  isActive: boolean;
}

export const DotButton: React.FunctionComponent<DotButtonProps> = ({
  isActive,
  ...props
}) => {
  return (
    <Button {...props}>
      <svg
        className={css({
          fill: isActive ? 'current' : 'white',
          stroke: 'current',
          width: '3',
        })}
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </Button>
  );
};
