import { Fade, Stack, SxProps, Theme, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { STYLE } from '../../../common/constant';
import { LoadingComponent } from '../../loading/loading.component';
import { StackBgDefaultBorRadLayCol } from '../../styles/stack.style';

export interface WrapperChartElementProps {
  name: string;
  loading: boolean;
  chart: ReactNode;
  sx?: SxProps<Theme>;
}

export const WrapperChartElement: React.FC<WrapperChartElementProps> = ({ name, loading, chart, sx }) => {
  return (
    <Fade in={true} timeout={STYLE.ANIMATION_TIME}>
      <StackBgDefaultBorRadLayCol>
        <Typography variant="subtitle1" sx={{ lineHeight: 1, textAlign: 'center' }}>
          {name}
        </Typography>

        <Stack
          sx={{
            height: `calc(100% - 14px - ${STYLE.PADDING_GAP_ITEM})`,
            ...sx,
          }}
        >
          {loading ? <LoadingComponent /> : chart}
        </Stack>
      </StackBgDefaultBorRadLayCol>
    </Fade>
  );
};
