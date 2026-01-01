import React, { useState } from 'react';
import { STYLE } from '@/common/constant';
import { StackRowAlignCenter } from '../../styles/stack.style';
import { TabComponent, TabsComponent } from '../../tabs/tabs.component';
import { motion, AnimatePresence } from 'framer-motion';
import { IconContentElement, IconContentElementProps } from './icon-content.element';
import { IconElement } from './icon.element';

export interface IconContentSubsElementProps extends IconContentElementProps {
  subs: TabComponent[];
  idSubSelect?: string;
}

export const IconContentSubsElement: React.FC<IconContentSubsElementProps> = ({
  icon,
  content,
  size,
  color = 'inherit',
  sx = {},
  sxIcon = {},
  id,
  subs,
  idSubSelect,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <StackRowAlignCenter
      id={id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        gap: STYLE.GAP_ICON_CONTENT_BY_SIZE[size || 'medium'],
        position: 'relative',
        cursor: 'pointer',
        ...sx,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '100%',
          left: 0,
          width: `calc(100% + ${STYLE.PADDING_GAP_ITEM})`,
          height: 20,
          pointerEvents: 'auto',
          zIndex: 2,
        },
      }}
    >
      <IconContentElement icon={icon} content={content} color={color} sxIcon={sxIcon} size={size} />

      <motion.span
        animate={{ rotate: hovered ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'inline-flex' }}
      >
        <IconElement icon="arrow_drop_down" sx={sxIcon} />
      </motion.span>

      <AnimatePresence>
        {hovered ? (
          <motion.div
            key="tabs"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              marginTop: '18px',
              right: 0,
              zIndex: 3,
              width: 'fit-content',
            }}
          >
            <TabsComponent tabs={subs} idSelect={idSubSelect} direction="column" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </StackRowAlignCenter>
  );
};
