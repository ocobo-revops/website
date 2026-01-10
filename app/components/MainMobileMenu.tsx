import * as React from 'react';

import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';

import { useMenuItems } from '~/hooks/useMenuItems';

import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { SubMenu } from './SubMenu';
import { Accordion } from './ui/Accordion';
import { ScrollArea } from './ui/ScrollArea';

const triggerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all',
  cursor: 'pointer',
  textStyle: 'nav',
  fontWeight: 'bold',
});

const itemStyles = css({
  p: '8',

  _last: {
    mt: 'auto',
    textAlign: 'center',
  },
});

const MainMobileMenu = () => {
  const items = useMenuItems();

  return (
    <MobileMenu>
      <Header />
      <ScrollArea>
        <Accordion.Root
          collapsible
          className={flex({
            direction: 'column',
            minHeight:
              'calc((var(--vh, 1vh) * 100) - var(--main-header-height-mobil))',
          })}
        >
          {items.map(({ key, title, url, subItems, className }) => (
            <React.Fragment key={key}>
              {url ? (
                <div className={itemStyles}>
                  <NavLink to={url} className={className ?? triggerStyles}>
                    {title}
                    {subItems && subItems.length > 0 && <ChevronRight />}
                  </NavLink>
                </div>
              ) : (
                <Accordion.Item value={key} className={itemStyles}>
                  <Accordion.Trigger className={triggerStyles}>
                    {title}
                  </Accordion.Trigger>
                  {subItems && subItems.length > 0 && (
                    <Accordion.Content>
                      <SubMenu.Root>
                        {subItems
                          .filter((item) => !item.shouldHide)
                          .map(({ key, title, url, variant }) => (
                            <SubMenu.Item key={key} variant={variant}>
                              <NavLink to={url}>{title}</NavLink>
                            </SubMenu.Item>
                          ))}
                      </SubMenu.Root>
                    </Accordion.Content>
                  )}
                </Accordion.Item>
              )}
            </React.Fragment>
          ))}
        </Accordion.Root>
      </ScrollArea>
    </MobileMenu>
  );
};

export { MainMobileMenu };
