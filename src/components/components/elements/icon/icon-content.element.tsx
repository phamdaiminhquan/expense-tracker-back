import { SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { getLimitLineCss } from '../../../common/utils/other.utils';
import { StackRowAlignCenter } from '../../styles/stack.style';
import { IconElement, IconElementProps } from './icon.element';

export interface IconContentElementProps extends IconElementProps {
  content: any;
  size?: 'large' | 'small' | 'medium';
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  sx?: SxProps<Theme>;
  sxIcon?: SxProps<Theme>;
  applyCssOnClick?: boolean;
  id?: string;
  isNowrap?: boolean;
}

export const IconContentElement: React.FC<IconContentElementProps> = ({
  icon,
  content,
  size,
  color = 'inherit',
  onClick,
  sx = {},
  sxIcon = {},
  fill = 0,
  applyCssOnClick,
  id,
  isNowrap = false,
}) => {
  if (onClick || applyCssOnClick)
    sx = {
      ...sx,
      cursor: 'pointer',
    };

  return (
    <StackRowAlignCenter
      onClick={onClick}
      sx={{ gap: STYLE.GAP_ICON_CONTENT_BY_SIZE[size || 'medium'], ...sx }}
      id={id}
    >
      {icon && <IconElement icon={icon!} sx={sxIcon} color={color} fill={fill} />}

      <Typography
        color={color}
        variant={size ? STYLE.VARIANT_BY_SIZE[size] : 'body1'}
        sx={{
          ...(isNowrap ? { whiteSpace: 'nowrap' } : getLimitLineCss(1)),
          transform: `translateY(0.5px)`,
        }}
      >
        {content}
      </Typography>
    </StackRowAlignCenter>
  );
};
