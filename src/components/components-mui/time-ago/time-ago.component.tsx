import { SxProps, Typography } from '@mui/material';
import React from 'react';
import { Theme } from '@emotion/react';
import { timeUtils } from '@/common/utils';
import { getLimitLineCss } from '@/common/utils/other.utils';

export interface TimeAgoComponentProps {
  time: Date | string;
  sx?: SxProps<Theme>;
  hasText?: boolean;
}

export const TimeAgoComponent: React.FC<TimeAgoComponentProps> = ({ time, hasText, sx = {} }) => {
  return (
    <Typography variant="caption" sx={{ ...getLimitLineCss(1), color: 'text.disabled', lineHeight: 1.2, ...sx }}>
      {(hasText ? 'Cập nhật lúc ' : '') + timeUtils.getTimeAgo(time)}
    </Typography>
  );
};
