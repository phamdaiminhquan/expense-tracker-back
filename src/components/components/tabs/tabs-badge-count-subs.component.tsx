import { useEffect, useId, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { Stack, useTheme } from '@mui/material';
import React from 'react';
import { LinkElement } from '../elements/link/link.element';
import { StackTabs } from '../styles/stack.style';
import { useLocation } from 'react-router-dom';
import { TAB_BACKGROUND_STYLES, TAB_STYLES } from './tabs.constant';
import { TabBadgeCount } from './tabs-badge-count.component';
import { IconContentBadgeCountSubsElement } from '../elements/icon/icon-content-badge-count-subs.element';
import { IconContentBadgeCountElement } from '../elements/icon/icon-content-badge-count.element';

export interface TabBadgeCountSubs {
  id?: string;
  icon: string;
  name: string;
  onClick?: () => void;
  href?: string;
  subs?: TabBadgeCount[];
  badgeCount: number;
}

export interface TabsBadgeCountSubsComponentProps {
  idSelect?: string;
  tabs: TabBadgeCountSubs[];
  size?: 'large' | 'small' | 'medium';
}

export const TabsBadgeCountSubsComponent: React.FC<TabsBadgeCountSubsComponentProps> = ({ idSelect, tabs, size }) => {
  const { palette } = useTheme();

  const location = useLocation();

  const [idSelected, setIdSelected] = useState(idSelect);

  const layoutGroupId = useId();

  useEffect(() => {
    setIdSelected(idSelect);
  }, [idSelect]);

  return (
    <LayoutGroup id={layoutGroupId}>
      <StackTabs direction={'row'}>
        {tabs.map((tab) => (
          <LinkElement
            component={tab.href ? 'a' : 'span'}
            href={tab.href}
            onClick={tab.onClick}
            key={tab.name}
            id={tab.id}
          >
            <Stack
              component={motion.div}
              sx={TAB_STYLES}
              initial={{ color: tab.id === idSelected ? palette.primary.contrastText : palette.text.primary }}
              animate={{ color: tab.id === idSelected ? palette.primary.contrastText : palette.text.primary }}
              transition={{ duration: 0.3 }}
              onTap={() => !tab.subs && setIdSelected(tab.id)}
            >
              {tab.subs ? (
                <IconContentBadgeCountSubsElement
                  icon={tab.icon}
                  content={tab.name}
                  badgeCount={tab.badgeCount}
                  sx={{ zIndex: 2 }}
                  size={size}
                  subs={tab.subs}
                  idSubSelect={tab.subs.find((sub) => location.pathname.split('/').at(-1) === sub.id)?.id}
                />
              ) : (
                <IconContentBadgeCountElement
                  icon={tab.icon}
                  content={tab.name}
                  sx={{ zIndex: 2 }}
                  size={size}
                  badgeCount={tab.badgeCount}
                />
              )}
              {tab.id === idSelected && (
                <Stack
                  component={motion.div}
                  sx={TAB_BACKGROUND_STYLES}
                  layoutId="selected"
                  animate={{ backgroundColor: palette.primary.main }}
                  initial={{ backgroundColor: palette.primary.main }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Stack>
          </LinkElement>
        ))}
      </StackTabs>
    </LayoutGroup>
  );
};
