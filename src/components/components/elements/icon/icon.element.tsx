import { Icon, IconProps, SxProps, Theme, useTheme } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';

export interface IconElementProps extends IconProps {
  icon: any;
  size?: 'large' | 'small' | 'medium';
  disabled?: boolean;
  fill?: 0 | 1;
  sx?: SxProps<Theme>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const IconElement: React.FC<IconElementProps> = ({
  icon,
  size = 'medium',
  color,
  disabled,
  onClick,
  sx,
  fill = 0,
}) => {
  const { palette } = useTheme();

  if (disabled) {
    onClick = undefined;
    color = 'disabled';
  }

  if (onClick)
    sx = {
      cursor: 'pointer',
      '&:hover': {
        color: color ? 'none' : palette.primary.main,
      },
      ...sx,
    };

  return (
    <Icon
      onClick={onClick}
      color={color}
      sx={{
        cursor: 'inherit',
        fontSize: STYLE.FONT_SIZE_ICON[size],
        fontVariationSettings: `'FILL' ${fill}, 'wght' 100, 'GRAD' 200, 'opsz' 24`,
        ...sx,
      }}
      component={'span'}
      className="material-symbols-rounded"
    >
      {icon}
    </Icon>
  );
};
