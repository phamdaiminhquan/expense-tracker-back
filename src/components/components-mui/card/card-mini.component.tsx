import { Fade, SxProps, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { StackBgDefaultBorRadLayCol, StackRowAlignCenter } from '../styles/stack.style';
import { IconElement } from '../elements/icon/icon.element';
import { LoadingComponent } from '../loading/loading.component';
import { STYLE } from '@/common/constant';

export interface CardMiniComponentProps {
  icon: string;
  title: string;
  past: string | number;
  current: string | number;
  loading: boolean;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | any;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  direction?: 'column' | 'row';
  sx?: SxProps<Theme>;
}

export const CardMiniComponent: React.FC<CardMiniComponentProps> = ({
  icon,
  title,
  past,
  current,
  color = 'inherit',
  onClick,
  sx = {},
  direction = 'column',
  loading,
}) => {
  const { palette } = useTheme();

  if (onClick) sx = { ...sx, cursor: 'pointer' };

  return (
    <Fade in={true} timeout={STYLE.ANIMATION_TIME}>
      <StackBgDefaultBorRadLayCol sx={{ flexDirection: direction, flex: 1, alignItems: 'center', ...sx }}>
        {loading ? (
          <LoadingComponent size="small" />
        ) : (
          <React.Fragment>
            <StackRowAlignCenter sx={{ gap: STYLE.PADDING_GAP_ITEM_SMALL }}>
              <Typography color={color + '.main'} variant="h1" sx={{ lineHeight: 1 }}>
                {current}
              </Typography>

              <IconElement fill={1} icon={icon} sx={{ fontSize: 25, color }} color={color} />
            </StackRowAlignCenter>

            <Typography variant="subtitle1" sx={{ color: palette.text.disabled, lineHeight: 1 }}>
              {past}
            </Typography>
          </React.Fragment>
        )}

        <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>
          {title}
        </Typography>
      </StackBgDefaultBorRadLayCol>
    </Fade>
  );
};
