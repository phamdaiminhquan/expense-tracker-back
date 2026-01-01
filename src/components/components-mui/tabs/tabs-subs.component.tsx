import { useEffect, useId, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { Stack, useTheme } from '@mui/material';
import React from 'react';
import { LinkElement } from '../elements/link/link.element';
import { StackTabs } from '../styles/stack.style';
import { TabComponent } from './tabs.component';
import { IconContentSubsElement } from '../elements/icon/icon-content-subs.element';
import { useLocation } from 'react-router-dom';
import { TAB_BACKGROUND_STYLES, TAB_STYLES } from './tabs.constant';
import { IconContentElement } from '../elements/icon/icon-content.element';

export interface TabSubs {
  id?: string;
  icon: string;
  name: string;
  onClick?: () => void;
  href?: string;
  subs?: TabComponent[];
}

export interface TabsSubsComponentProps {
  idSelect?: string;
  tabs: TabSubs[];
  size?: 'large' | 'small' | 'medium';
}

export const TabsSubsComponent: React.FC<TabsSubsComponentProps> = ({ idSelect, tabs, size }) => {
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
                <IconContentSubsElement
                  icon={tab.icon}
                  content={tab.name}
                  sx={{ zIndex: 2 }}
                  size={size}
                  subs={tab.subs}
                  idSubSelect={tab.subs.find((sub) => location.pathname.includes(sub.id))?.id}
                />
              ) : (
                <IconContentElement icon={tab.icon} content={tab.name} sx={{ zIndex: 2 }} size={size} />
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
