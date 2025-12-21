import { SxProps, Theme, Typography, TypographyProps } from '@mui/material';
import React from 'react';
import { getLimitLineCss } from '../../../common/utils/other.utils';

export interface TypographyOneLineProps extends TypographyProps {
  sx?: SxProps<Theme>;
  content: string;
}

export const TypographyOneLine: React.FC<TypographyOneLineProps> = ({ content, sx = {}, ...rest }) => {
  return (
    <Typography
      sx={
        {
          ...getLimitLineCss(1),
          ...sx,
        } as SxProps<Theme>
      }
      {...rest}
    >
      {content || '#'}
    </Typography>
  );
};
