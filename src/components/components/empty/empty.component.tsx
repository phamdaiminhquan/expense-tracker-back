import { STYLE } from '@/common/constant';
import { Box, Fade, Stack } from '@mui/material';
import React from 'react';

export interface EmptyComponentProps {}

export const EmptyComponent: React.FC<EmptyComponentProps> = ({}) => {
  return (
    <Fade in={true} timeout={STYLE.ANIMATION_TIME}>
      <Stack
        direction="column"
        sx={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: STYLE.PADDING_GAP_ITEM,
        }}
      >
        <Box component="img" sx={{ width: 70 }} src="/images/empty.svg" />
      </Stack>
    </Fade>
  );
};
