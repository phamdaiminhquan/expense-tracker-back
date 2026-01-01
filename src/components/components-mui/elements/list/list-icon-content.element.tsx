import React, { ReactNode } from 'react';
import { List, ListItem, useTheme } from '@mui/material';
import { STYLE } from '@/common/constant';
import { IconContentElement } from '../icon/icon-content.element';

export interface ListIconContentElementProps {
  titleNode?: ReactNode;
  list: { content: string; onClick: () => void; icon: string }[];
}

export const ListIconContentElement: React.FC<ListIconContentElementProps> = ({ titleNode, list }) => {
  const { palette } = useTheme();

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
      }}
    >
      {titleNode && (
        <ListItem
          sx={{
            padding: STYLE.PADDING_GAP_ITEM,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            '&:hover': {
              cursor: 'default',
              backgroundColor: 'unset',
              color: 'unset',
            },
          }}
        >
          {titleNode}
        </ListItem>
      )}
      {list.map((e) => (
        <ListItem
          key={e.content}
          onClick={e.onClick}
          sx={{
            borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
            padding: STYLE.PADDING_GAP_ITEM,
            transition: STYLE.TRANSITION_TIME,
            '&:hover': {
              cursor: 'pointer',
              backgroundColor: palette.action.hover,
            },
          }}
        >
          <IconContentElement content={e.content} icon={e.icon} />
        </ListItem>
      ))}
    </List>
  );
};
