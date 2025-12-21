import { Fade, Stack, SxProps, Theme, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import { STYLE } from '../../../common/constant';
import { IconContentElement } from '../icon/icon-content.element';
import { LoadingComponent } from '../../loading/loading.component';
import { StackRowJustBetween } from '../../styles/stack.style';

export interface WrapperElementProps {
  iconLabel?: string;
  labelId?: string;
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
  sxLabel?: SxProps<Theme>;
  divider?: ReactNode;
}

export const WrapperElement: React.FC<WrapperElementProps> = ({
  iconLabel = 'format_list_bulleted',
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
  sxLabel = {},
  divider,
  labelId,
}) => {
  const { palette } = useTheme();

  return (
    <Fade in={true} timeout={STYLE.ANIMATION_TIME}>
      <Stack
        sx={{
          ...(width ? { width } : { flex }),
          backgroundColor: palette.background.paper,
          borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: 1,
          height,
          gap: 'unset',
          ...sx,
        }}
      >
        {(label || nodeLabel) && (
          <StackRowJustBetween
            sx={{
              position: 'sticky',
              alignItems: 'stretch',
              top: 0,
              padding: STYLE.PADDING_GAP_LAYOUT,
              backgroundColor: 'transparent',
              zIndex: 1,
              overflow: 'auto',
              ...sxLabel,
            }}
          >
            {label && <IconContentElement id={labelId} icon={iconLabel} content={label} size={labelSize} />}
            {nodeLabel && (
              <Stack
                sx={{
                  flexDirection: directionNodeLabel,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {nodeLabel}
              </Stack>
            )}
          </StackRowJustBetween>
        )}
        <Stack
          sx={{
            flex: 1,
            flexDirection: direction,
            padding: STYLE.PADDING_GAP_LAYOUT,
            paddingTop: label || nodeLabel ? 0 : STYLE.PADDING_GAP_LAYOUT,
            ...sxChildren,
          }}
          divider={divider}
        >
          {loading ? <LoadingComponent /> : children}
        </Stack>
      </Stack>
    </Fade>
  );
};
