import React, { useState } from 'react';
import { STYLE } from '../../../common/constant';
import { StackRowAlignCenter } from '../../styles/stack.style';
import { motion, AnimatePresence } from 'framer-motion';
import { IconContentElementProps } from './icon-content.element';
import { IconElement } from './icon.element';
import { TabBadgeCount, TabsBadgeCountComponent } from '../../tabs/tabs-badge-count.component';
import { IconContentBadgeCountElement } from './icon-content-badge-count.element';

export interface IconContentBadgeCountSubsElementProps extends IconContentElementProps {
  subs: TabBadgeCount[];
  idSubSelect?: string;
  badgeCount: number;
}

export const IconContentBadgeCountSubsElement: React.FC<IconContentBadgeCountSubsElementProps> = ({
  icon,
  content,
  size,
  color = 'inherit',
  sx = {},
  sxIcon = {},
  id,
  subs,
  idSubSelect,
  badgeCount,
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
      <IconContentBadgeCountElement
        icon={icon}
        content={content}
        color={color}
        sxIcon={sxIcon}
        size={size}
        badgeCount={badgeCount}
        sxBadge={{ right: -24 }}
      />

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
            <TabsBadgeCountComponent tabs={subs} idSelect={idSubSelect} direction="column" isSubs />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </StackRowAlignCenter>
  );
};
