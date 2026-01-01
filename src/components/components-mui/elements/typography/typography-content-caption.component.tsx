import { Stack, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { getLimitLineCss } from '../../../common/utils/other.utils';
import { TypographyOneLine } from './typography-limit-one-line.component';
import { STYLE } from '@/common/constant';

export interface TypographyContentCaptionProps {
  sx?: SxProps<Theme>;
  content: string;
  caption: string;
  height?: number | string;
}

export const TypographyContentCaption: React.FC<TypographyContentCaptionProps> = ({
  content,
  caption,
  height = STYLE.HEIGHT_IMAGE_DEFAULT,
  sx = {},
}) => {
  return (
    <Stack sx={{ height, gap: 0, justifyContent: 'space-between', alignItems: 'flex-start', ...sx }}>
      <TypographyOneLine content={content} />
      <Typography
        variant="caption"
        sx={{
          ...getLimitLineCss(1),
          color: 'text.disabled',
          transform: 'translateY(2px)',
        }}
      >
        {caption}
      </Typography>
    </Stack>
  );
};
