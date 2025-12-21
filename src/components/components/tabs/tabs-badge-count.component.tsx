import { useEffect, useId, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { Stack, useTheme } from '@mui/material';
import React from 'react';
import { LinkElement } from '../elements/link/link.element';
import { StackTabs } from '../styles/stack.style';
import { TAB_STYLES, TAB_BACKGROUND_STYLES } from './tabs.constant';
import { TabComponent } from './tabs.component';
import { IconContentBadgeCountElement } from '../elements/icon/icon-content-badge-count.element';

export interface TabBadgeCount extends TabComponent {
  badgeCount: number;
}

export interface TabsBadgeCountComponentProps {
  idSelect?: string;
  tabs: TabBadgeCount[];
  size?: 'large' | 'small' | 'medium';
  direction?: 'column' | 'row';
  isSubs?: boolean;
}

export const TabsBadgeCountComponent: React.FC<TabsBadgeCountComponentProps> = ({
  idSelect,
  tabs,
  size,
  direction = 'row',
  isSubs = false,
}) => {
  const { palette } = useTheme();

  const [selected, setSelected] = useState(idSelect);
  const layoutGroupId = useId();

  useEffect(() => {
    setSelected(idSelect);
  }, [idSelect]);
  return (
    <LayoutGroup id={layoutGroupId}>
      <StackTabs direction={direction}>
        {tabs.map((tab) => {
          return (
            <LinkElement
              component={tab.href ? 'a' : 'span'}
              href={tab.href}
              onClick={tab.onClick}
              key={tab.id}
              id={tab.id}
            >
              <Stack
                component={motion.div}
                sx={TAB_STYLES}
                initial={{ color: tab.id === selected ? palette.primary.contrastText : palette.text.primary }}
                animate={{ color: tab.id === selected ? palette.primary.contrastText : palette.text.primary }}
                transition={{ duration: 0.3 }}
                onTap={() => setSelected(tab.id)}
              >
                <IconContentBadgeCountElement
                  icon={tab.icon}
                  content={tab.name}
                  badgeCount={tab.badgeCount}
                  sx={{ zIndex: 1 }}
                  sxBadge={isSubs ? { top: 1, right: -14 } : {}}
                  size={size}
                  isNowrap
                  isAddCountToContent
                />

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
          );
        })}
      </StackTabs>
    </LayoutGroup>
  );
};
