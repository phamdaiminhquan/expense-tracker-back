import { Fade, Stack, SxProps, Theme } from '@mui/material';
import React, { ReactNode } from 'react';
import { STYLE } from '@/common/constant';
import { IconContentElement } from '../icon/icon-content.element';
import { LoadingComponent } from '../../loading/loading.component';
import { StackRowJustBetween } from '../../styles/stack.style';

export interface WrapperContentElementProps {
  iconLabel?: string;
  label?: string;
  nodeLabel?: ReactNode;
  labelSize?: 'large' | 'small' | 'medium';
  flex?: number;
  height?: string | number | 'fit-content';
  width?: string | number | 'fit-content';
  direction?: 'column' | 'row';
  directionNodeLabel?: 'column' | 'row';
  loading?: boolean;
  sx?: SxProps<Theme>;
  children?: ReactNode;
  sxChildren?: SxProps<Theme>;
}

export const WrapperContentElement: React.FC<WrapperContentElementProps> = ({
  iconLabel,
  label,
  nodeLabel,
  labelSize = 'medium',
  flex = 1,
  height = 'fit-content',
  width,
  direction = 'column',
  directionNodeLabel = 'column',
  sx = {},
  loading = false,
  children,
  sxChildren = {},
}) => {
  return (
    <Fade in={true} timeout={STYLE.ANIMATION_TIME}>
      <Stack
        sx={{
          ...(width ? { width } : { flex }),
          overflowY: 'auto',
          overflowX: 'hidden',
          height,
          ...sx,
        }}
      >
        {(label || nodeLabel) && (
          <StackRowJustBetween
            sx={{
              position: 'sticky',
              alignItems: 'stretch',
              top: 0,
              zIndex: 1,
              overflow: 'auto',
            }}
          >
            {label && <IconContentElement icon={iconLabel} content={label} size={labelSize} />}
            {nodeLabel && <Stack sx={{ flexDirection: directionNodeLabel }}>{nodeLabel}</Stack>}
          </StackRowJustBetween>
        )}
        <Stack
          sx={{
            flex: 1,
            flexDirection: direction,
            paddingTop: label || nodeLabel ? 0 : STYLE.PADDING_GAP_LAYOUT,
            ...sxChildren,
          }}
        >
          {loading ? <LoadingComponent /> : children}
        </Stack>
      </Stack>
    </Fade>
  );
};
