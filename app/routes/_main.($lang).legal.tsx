import { Outlet } from 'react-router';

import { Grid, GridItem } from '@ocobo/styled-system/jsx';

import { Container } from '~/components/ui/Container';

export default function LegalLayout() {
  return (
    <Container isMobileFullWidth>
      <Grid columns={{ base: 1, lg: 6 }}>
        <GridItem colSpan={4}>
          <Outlet />
        </GridItem>
      </Grid>
    </Container>
  );
}
