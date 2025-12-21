import { Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material';
import React from 'react';

export interface LinkInternalElementProps {
  content: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
}

export const LinkInternalElement: React.FC<LinkInternalElementProps> = ({ content, onClick, sx = {} }) => {
  return (
    <Typography
      onClick={onClick}
      sx={{
        color: 'inherit',
        textDecorationColor: 'inherit',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline',
        },
        ...sx,
      }}
    >
      {content}
    </Typography>
  );
};
