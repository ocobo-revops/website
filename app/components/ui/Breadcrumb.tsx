import { styled } from '@ocobo/styled-system/jsx';

export const Breadcrumb = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    textStyle: 'small',
    color: 'gray',
    position: 'absolute',
    top: '-8',

    '& a': {
      color: 'gray',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
      '& + a': {
        ml: '1',
        '&::before': {
          content: '"\\00BB"',
          display: 'inline-block',
          mx: '1',
        },
      },
    },
  },
});
