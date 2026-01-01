import { Typography, useTheme } from '@mui/material';
import React from 'react';
import { STYLE } from '@/common/constant';

export interface TagOnClickElementProps {
  content: string;
  active: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium';
}

export const TagOnClickElement: React.FC<TagOnClickElementProps> = ({
  content,
  onClick,
  active = false,
  size = 'small',
}) => {
  const { palette } = useTheme();

  const isSmall = size === 'small';

  return (
    <Typography
      variant={isSmall ? 'caption' : 'body1'}
      onClick={active ? undefined : onClick}
      sx={{
        padding: `calc(${isSmall ? STYLE.PADDING_GAP_ITEM_SMALL : STYLE.PADDING_GAP_ITEM} - 4px) ${isSmall ? STYLE.PADDING_GAP_ITEM_SMALL : STYLE.PADDING_GAP_ITEM}`,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT_SMALL,
        border: `1px solid ${active ? palette.primary.main : palette.text.primary}`,
        color: active ? palette.primary.main : palette.text.primary,
        cursor: active ? 'default' : 'pointer',
      }}
    >
      {content}
    </Typography>
  );
};
