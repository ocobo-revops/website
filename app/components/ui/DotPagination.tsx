import { styled } from '@ocobo/styled-system/jsx';

import { DotButton } from './DotButton';

const Wrapper = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4',
    pt: '4',
  },
});

interface DotPaginationProps extends React.ComponentProps<typeof Wrapper> {
  activePageIndex: number;
  goTo: (index: number) => void;
  pageCount: number;
}

export const DotPagination: React.FunctionComponent<DotPaginationProps> = ({
  goTo,
  activePageIndex,
  pageCount,
  ...props
}) => {
  const pages = new Array(pageCount).fill(0);
  return (
    <Wrapper aria-hidden {...props}>
      {pages.map((_, i) => (
        <DotButton
          key={i}
          isActive={activePageIndex === i}
          onClick={() => goTo(i)}
        />
      ))}
    </Wrapper>
  );
};
