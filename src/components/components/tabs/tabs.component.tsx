import { useEffect, useId, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { Stack, useTheme } from '@mui/material';
import React from 'react';
import { IconContentElement } from '../elements/icon/icon-content.element';
import { LinkElement } from '../elements/link/link.element';
import { StackTabs } from '../styles/stack.style';
import { TAB_STYLES, TAB_BACKGROUND_STYLES } from './tabs.constant';

export interface TabComponent {
  id: string;
  icon: string;
  name: string;
  onClick: () => void;
  href?: string;
}

export interface TabsComponentProps {
  idSelect?: string;
  tabs: TabComponent[];
  size?: 'large' | 'small' | 'medium';
  direction?: 'column' | 'row';
}

export const TabsComponent: React.FC<TabsComponentProps> = ({ idSelect, tabs, size, direction = 'row' }) => {
  const { palette } = useTheme();

  const [selected, setSelected] = useState(idSelect);

  const layoutGroupId = useId();

  useEffect(() => {
    setSelected(idSelect);
  }, [idSelect]);

  return (
    <LayoutGroup id={layoutGroupId}>
      <StackTabs direction={direction}>
        {tabs.map((tab) => (
          <LinkElement href={tab.href} onClick={tab.onClick} key={tab.id} id={tab.id}>
            <Stack
              component={motion.div}
              sx={TAB_STYLES}
              initial={{ color: tab.id === selected ? palette.primary.contrastText : palette.text.primary }}
              animate={{ color: tab.id === selected ? palette.primary.contrastText : palette.text.primary }}
              transition={{ duration: 0.3 }}
              onTap={() => setSelected(tab.id)}
            >
              <IconContentElement icon={tab.icon} content={tab.name} sx={{ zIndex: 1 }} size={size} isNowrap />

              {tab.id === selected && (
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
