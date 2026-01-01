import { Stack, SxProps, Theme } from '@mui/material';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { STYLE } from '@/common/constant';

export interface LoadingComponentProps {
  color?: string;
  size?: 'large' | 'small' | 'medium';
  sx?: SxProps<Theme>;
}

export const LoadingComponent: React.FC<LoadingComponentProps> = ({ color, size = 'medium', sx = {} }) => {
  return (
    <Stack sx={{ ...sx, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress size={STYLE.FONT_SIZE_LOADING[size]} sx={{ color }} />
    </Stack>
  );
};
