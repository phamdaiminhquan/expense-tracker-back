import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { STYLE } from '@/common/constant';
import { WrapperCenterElement } from '../wrapper/wrapper-center.element';

export interface IconImageElementProps {
  size?: 'large' | 'small' | 'medium';
  disabled?: boolean;
  sx?: SxProps<Theme>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  src: string;
  isWrap?: boolean;
}

export const IconImageElement: React.FC<IconImageElementProps> = ({
  size = 'medium',
  disabled,
  onClick,
  sx,
  src,
  isWrap,
}) => {
  const isClickable = !!onClick && !disabled;

  return (
    <WrapperCenterElement isWrap={isWrap}>
      <Box
        component="img"
        src={src}
        alt="Icon"
        onClick={isClickable ? onClick : undefined}
        sx={{
          width: STYLE.FONT_SIZE_ICON[size],
          height: STYLE.FONT_SIZE_ICON[size],
          opacity: disabled ? 0.5 : 1,
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'transform 0.2s ease, filter 0.2s ease',
          ...(isClickable && {
            '&:hover': { transform: 'scale(1.1)', filter: 'brightness(0.9)' },
          }),
          ...sx,
        }}
      />
    </WrapperCenterElement>
  );
};
